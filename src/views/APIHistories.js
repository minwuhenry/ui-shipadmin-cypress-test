import { useState } from 'react'
import axios from 'axios'
import {
  Anchor,
  Button,
  Card,
  Form,
  GridContainer,
  GridItem,
  Layout,
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from '@enterprise-ui/canvas-ui-react'
//import { useAuth } from '@praxis/component-auth'

import { SectionHeader } from '../globalComponents/SectionHeader'
import { useEnv } from '@praxis/component-runtime-env'

export const APIHistories = () => {
  const env = useEnv()
  let apiHistoryRequestAttrs = null

  try {
    apiHistoryRequestAttrs = env.apiHistoryRequest

    if (typeof apiHistoryRequestAttrs.requestTimeoutSeconds === 'undefined') {
      apiHistoryRequestAttrs.requestTimeoutSeconds = 0
    }
  } catch (e) {
    apiHistoryRequestAttrs = null
  }

  if (
    typeof apiHistoryRequestAttrs === 'undefined' ||
    apiHistoryRequestAttrs === null
  ) {
    apiHistoryRequestAttrs = {
      defaultPageSize: 50,
      defaultTimeRange: null,
      maxTimeRangeDays: '90d',
      maxLabel: '90 days',
      requestTimeoutSeconds: 0,
    }
  }

  const DEFAULT_PAGE_SIZE = apiHistoryRequestAttrs.defaultPageSize
  const DEFAULT_SORTING_ORDER = 'ahRequestMicroTime'

  //const time = new Date()
  //const offset = time.getTimezoneOffset() * 60 * 1000
  //const timeLocal = new Date(time - offset)
  //const isoString = timeLocal.toISOString()
  //const dateString = isoString.slice(0, 10)
  const [orderId, setOrderId] = useState([])
  const [startDate, setStartDate] = useState([])
  const [endDate, setEndDate] = useState([])
  const [sessionId, setSessionId] = useState([])
  const [serviceProvider, setServiceProvider] = useState([])
  const [apiName, setApiName] = useState([])
  //const [errorCode, setErrorCode] = useState([])
  const [storeId, setStoreId] = useState([])
  //const [apiSuccessful, setApiSuccessful] = useState([])
  const [clientReferenceId, setClientReferenceId] = useState([])
  const [data, setData] = useState([])
  const [gmtStartDate, setGmtStartDate] = useState([])
  const [gmtEndDate, setGmtEndDate] = useState([])
  const [totalElements, setTotalElements] = useState([-1])
  const [pageNumber, setPageNumber] = useState([0])
  const [pageSize] = useState([DEFAULT_PAGE_SIZE])
  const [sortingOrder] = useState([DEFAULT_SORTING_ORDER])
  const [waitMode, setWaitMode] = useState('')
  const [timeRange, setTimeRange] = useState('')
  const [resetStartEndDateOnSearch, setResetStartEndDateOnSearch] =
    useState(false)
  const [initialized, setInitialized] = useState(false)
  //const [searchCompleted, setSearchCompleted] = useState(false)
  const [startDateForSearch, setStartDateForSearch] = useState([''])
  const [endDateForSearch, setEndDateForSearch] = useState([''])
  const [orderIdForSearch, setOrderIdForSearch] = useState([''])
  const [sessionIdForSearch, setSessionIdForSearch] = useState([''])
  const [serviceProviderForSearch, setServiceProviderForSearch] = useState([''])
  const [apiNameForSearch, setApiNameForSearch] = useState([''])
  const [storeIdForSearch, setStoreIdForSearch] = useState([''])
  const [clientReferenceIdForSearch, setClientReferenceIdForSearch] = useState([
    '',
  ])

  const resetStartDate = () => {
    setStartDate('')
    setGmtStartDate(0)
    setTimeRange('')
    setResetStartEndDateOnSearch(false)
  }

  const resetEndDate = () => {
    setEndDate('')
    setGmtEndDate(0)
    setTimeRange('')
    setResetStartEndDateOnSearch(false)
  }

  // dateObj = if null take now, offsetStr = '90d', addOrSubtract = true - add, false - subtract
  const getNewDateWithOffset = (dateObj, offsetStr, addOrSubtract) => {
    let number = (addOrSubtract ? 1 : -1) * parseInt(offsetStr, 10)
    let interval = offsetStr.substring(offsetStr.length - 1)

    if (dateObj == null) {
      dateObj = new Date()
    }

    switch (interval) {
      case 'd':
        dateObj.setDate(dateObj.getDate() + number)
        break
      case 'w':
        dateObj.setDate(dateObj.getDate() + number * 7)
        break
      case 'M':
        dateObj.setMonth(dateObj.getMonth() + number)
        break
      case 'Y':
        dateObj.setFullYear(dateObj.getFullYear() + number)
        break
      default:
    }

    return dateObj
  }

  let rightnow = new Date()
  let offset = 1000 * 60 * rightnow.getTimezoneOffset()
  rightnow = new Date(rightnow.getTime() - offset)

  if (!initialized) {
    setTimeout(() => {
      setInitialized(true)
      resetStartDate()
      resetEndDate()

      if (
        typeof apiHistoryRequestAttrs.defaultTimeRange === 'string' &&
        apiHistoryRequestAttrs.defaultTimeRange !== null &&
        apiHistoryRequestAttrs.defaultTimeRange !== ''
      ) {
        setTimeRange(apiHistoryRequestAttrs.defaultTimeRange)
        resetStartEndDates(apiHistoryRequestAttrs.defaultTimeRange)
      }

      setResetStartEndDateOnSearch(true)
    }, 1)
  }

  const convertDateToGMT = (d) => {
    try {
      console.log(d ? new Date(d).toISOString() : '')
      return d ? new Date(d).toISOString() : null
    } catch (e) {
      return null
    }
  }

  const getTotalPageCount = () => {
    return Math.trunc(
      (totalElements + DEFAULT_PAGE_SIZE - 1) / DEFAULT_PAGE_SIZE,
    )
  }

  const hasValue = (valObj) => {
    return typeof valObj === 'string' && valObj !== null && valObj.trim() !== ''
  }

  const adjustTZOffset = (dateObj, tzoffset) => {
    let tzoffsetDiff = 1000 * 60 * dateObj.getTimezoneOffset() - tzoffset
    if (tzoffsetDiff !== 0) {
      dateObj = new Date(dateObj.getTime() - tzoffsetDiff)
    }
    return dateObj
  }

  // return: null - stop; {startDateStr: ..., endDateStr: ...}
  const adjustSearchCriteriaBeforeFetchingData = () => {
    let endDateStr = gmtEndDate
    if (typeof gmtEndDate !== 'string') {
      endDateStr = ''
    }
    let startDateStr = gmtStartDate
    if (typeof gmtStartDate !== 'string') {
      startDateStr = ''
    }

    console.log(
      'TimeRange=' +
        timeRange +
        ';Start=' +
        startDateStr +
        ';End=' +
        endDateStr +
        ':',
    )

    let searchableFieldsCnt = 0
    if (hasValue(orderId)) searchableFieldsCnt++
    if (hasValue(sessionId)) searchableFieldsCnt++
    if (hasValue(clientReferenceId)) searchableFieldsCnt++
    if (hasValue(serviceProvider)) searchableFieldsCnt++
    if (hasValue(storeId)) searchableFieldsCnt++
    if (hasValue(apiName)) searchableFieldsCnt++

    let isSingleCriteria =
      hasValue(orderId) || hasValue(sessionId) || hasValue(clientReferenceId)

    if (isSingleCriteria && searchableFieldsCnt > 1) {
      alert(
        'Fields order_id, session_id, client_reference_id should be single searchable fields and not paired with any other field.',
      )
      return null
    }

    if (isSingleCriteria) {
      setTimeout(() => {
        resetStartDate()
        resetEndDate()
      }, 1)
      startDateStr = ''
      endDateStr = ''
    }

    if (
      startDateStr !== '' &&
      endDateStr !== '' &&
      Date.parse(startDateStr) > Date.parse(endDateStr)
    ) {
      alert('Please select Start Date that is prior to End Date.')
      return null
    }

    // check: if selected time range exceeds the max
    if (timeRange === '' && !isSingleCriteria) {
      let tzoffset = 1000 * 60 * new Date().getTimezoneOffset()

      if (startDateStr !== '' && endDateStr !== '') {
        let sd = Date.parse(startDateStr) // millis
        let sdWithMaxOffset = adjustTZOffset(new Date(sd - tzoffset), tzoffset)
        startDateStr = sdWithMaxOffset.toISOString().slice(0, -1)

        let ed = Date.parse(endDateStr) // millis
        let edWithMaxOffset = adjustTZOffset(new Date(ed - tzoffset), tzoffset)
        endDateStr = edWithMaxOffset.toISOString().slice(0, -1)

        // for comparison
        sdWithMaxOffset = getNewDateWithOffset(
          new Date(sd - tzoffset),
          apiHistoryRequestAttrs.maxTimeRangeDays,
          true,
        )
        if (ed > sdWithMaxOffset.getTime()) {
          alert(
            'The time range for your request exceeds the limit of ' +
              apiHistoryRequestAttrs.maxLabel +
              '.\nPlease narrow down the time range.',
          )
          return null
        }
      } else if (startDateStr === '' && endDateStr !== '') {
        alert(
          'Please set the Start Date for your request.\n\nThe time range for your request should not exceed the limit of ' +
            apiHistoryRequestAttrs.maxLabel +
            '.',
        )
        return null
      } else if (startDateStr !== '') {
        let sd = Date.parse(startDateStr) // millis
        let ed =
          endDateStr === '' ? new Date().getTime() : Date.parse(endDateStr) // millis
        let sdWithMaxOffset = getNewDateWithOffset(
          new Date(sd - tzoffset),
          apiHistoryRequestAttrs.maxTimeRangeDays,
          true,
        )
        if (ed > sdWithMaxOffset.getTime()) {
          alert(
            'Please set the End Date for your request.\n\nThe time range for your request should not exceed the limit of ' +
              apiHistoryRequestAttrs.maxLabel +
              '.',
          )
          return null
        } else {
          let sd = Date.parse(startDateStr) // millis
          let sdWithMaxOffset = adjustTZOffset(
            new Date(sd - tzoffset),
            tzoffset,
          )
          startDateStr = sdWithMaxOffset.toISOString().slice(0, -1)
        }
      } else {
        alert(
          'The time range for your request exceeds the limit of ' +
            apiHistoryRequestAttrs.maxLabel +
            '.\nPlease narrow down the time range.',
        )
        return null
      }
    }

    if (
      (hasValue(serviceProvider) || hasValue(storeId) || hasValue(apiName)) &&
      startDateStr === ''
    ) {
      alert(
        'Fields service_provider, store_id and api_name should be always paried with start and end date.',
      )
      return null
    }

    console.log('Adjusted time range:' + startDateStr + ' to ' + endDateStr)
    return { startDateStr: startDateStr, endDateStr: endDateStr }
  }

  const retrieveHistoryPage = (e, pageNumber, mode, startDt, endDt) => {
    e.preventDefault()

    let startDateStr =
      typeof startDt !== 'undefined' ? startDt : startDateForSearch
    let endDateStr = typeof endDt !== 'undefined' ? endDt : endDateForSearch

    let startDateCrit = startDateStr
    let endDateCrit = endDateStr
    let orderIdCrit = orderId
    let sessionIdCrit = sessionId
    let serviceProviderCrit = serviceProvider
    let apiNameCrit = apiName
    let storeIdCrit = storeId
    let clientReferenceIdCrit = clientReferenceId

    if (mode === 'SEARCH') {
      //setSearchCompleted(true)
      setStartDateForSearch(startDateStr)
      setEndDateForSearch(endDateStr)
      setOrderIdForSearch(orderId)
      setSessionIdForSearch(sessionId)
      setServiceProviderForSearch(serviceProvider)
      setApiNameForSearch(apiName)
      setStoreIdForSearch(storeId)
      setClientReferenceIdForSearch(clientReferenceId)
    } else {
      startDateCrit = startDateForSearch
      endDateCrit = endDateForSearch
      orderIdCrit = orderIdForSearch
      sessionIdCrit = sessionIdForSearch
      serviceProviderCrit = serviceProviderForSearch
      apiNameCrit = apiNameForSearch
      storeIdCrit = storeIdForSearch
      clientReferenceIdCrit = clientReferenceIdForSearch
    }

    console.log('retrieveHistoryPage:init:' + startDt + ' - ' + endDt)
    console.log('retrieveHistoryPage:' + startDateStr + ' - ' + endDateStr)

    console.log(
      'retrieveHistoryPage:CRIT:' + startDateCrit + ' - ' + endDateCrit,
    )
    if (startDateCrit !== null && startDateCrit !== '') {
      startDateCrit = new Date(startDateCrit)
    }
    if (endDateCrit !== null && endDateCrit !== '') {
      endDateCrit = new Date(endDateCrit)
    }

    let error = null

    const fetchApiHistories = async () => {
      setWaitMode(mode)

      const response = await axios
        .get(env.api.apiHistory, {
          // append a space to text value to pass a param in url even if not set. Trim on backend side.
          timeout: apiHistoryRequestAttrs.requestTimeoutSeconds * 1000, // millis
          params: {
            order_id: orderIdCrit + ' ',
            start_date: startDateCrit,
            end_date: endDateCrit,
            session_id: sessionIdCrit + ' ',
            service_provider: serviceProviderCrit + ' ',
            api_name: apiNameCrit + ' ',
            store_id: storeIdCrit + ' ',
            client_reference_id: clientReferenceIdCrit + ' ',
            page_number: pageNumber,
            page_size: DEFAULT_PAGE_SIZE,
            sorting: sortingOrder + ' ',
          },
        })
        .catch((err) => {
          error = err
        })

      if (error !== null) {
        console.log(error.message)
        alert(
          'Request cannot be completed.\n\nPlease narrow down the Time Range and try again.',
        )
        setWaitMode('')
        return
      }

      const str = response.data.content
      const totalElements = response.data.totalElements
      setData(str)
      console.log(
        'pageNumber:' +
          pageNumber +
          '; pageSize:' +
          pageSize +
          '; totalElements:' +
          totalElements +
          '; elementsOnPage=' +
          response.data.content.length,
      )
      console.log(str)

      if (pageNumber === 0) {
        setTotalElements(totalElements)
      }

      setPageNumber(pageNumber)
      setWaitMode('')
    }
    fetchApiHistories()
  }

  const prettifyXml = (sourceXml) => {
    let xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml')
    let xsltDoc = new DOMParser().parseFromString(
      [
        // describes how we want to modify the XML - indent everything
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
        '    <xsl:value-of select="normalize-space(.)"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        '  </xsl:template>',
        '  <xsl:output indent="yes"/>',
        '</xsl:stylesheet>',
      ].join('\n'),
      'application/xml',
    )

    let xsltProcessor = new XSLTProcessor()
    xsltProcessor.importStylesheet(xsltDoc)
    let resultDoc = xsltProcessor.transformToDocument(xmlDoc)
    let resultXml = new XMLSerializer().serializeToString(resultDoc)
    return resultXml
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let adjustedTimes = adjustSearchCriteriaBeforeFetchingData()
    if (adjustedTimes == null) return

    let startDt = adjustedTimes.startDateStr
    let endDt = adjustedTimes.endDateStr
    console.log('retrieveHistoryPage:adjustedTimes' + startDt + ' - ' + endDt)
    if (resetStartEndDateOnSearch) {
      let adjustedDt = resetStartEndDates(timeRange)
      if (typeof adjustedDt.start !== 'undefined' && startDt !== '') {
        startDt = adjustedDt.start
      }
      if (typeof adjustedDt.end !== 'undefined' && endDt !== '') {
        endDt = adjustedDt.end
      }

      console.log('ADJUSTED:' + startDt + ' - ' + endDt)
    }

    console.log('handleSubmit:' + startDt + ' - ' + endDt)
    retrieveHistoryPage(e, 0, 'SEARCH', startDt, endDt)
  }

  // fileKey usually: S3://BUCKET/...
  const handleDownloadHistoryFile = async (
    fileKey,
    apiHistObj,
    fileType,
    isZipFile,
  ) => {
    setWaitMode(fileType + apiHistObj.apihistories_id)
    let error = null

    const response = await axios({
      url: env.api.apiHistoryDownload,
      method: 'POST',
      responseType: isZipFile ? 'blob' : 'text', //'arraybuffer',
      params: {
        isZipFile: isZipFile,
        fileNamePrefix: '',
      },
      data: {
        ids: fileKey,
      },
      headers: {
        //'Content-Type': 'application/zip',
      },
    }).catch((err) => {
      error = err
    })

    if (error !== null) {
      console.log(error.message)
      alert('Request cannot be completed.')
      setWaitMode('')
      return
    }

    if (!isZipFile) {
      let rawData = JSON.stringify(response.data)
      console.log('Data length: ' + rawData.length + ':' + rawData + ':')
      if (rawData.substring(0, 1) === '"') {
        rawData = rawData.substring(1, rawData.length - 1).trim()
      }

      if (rawData.includes('File could not be retrieved from TOSS')) {
        console.log('NO data, so returning')
        alert('Document is not available')
        setWaitMode('')
        return
      }

      let fileDescription =
        '// File: ' +
        fileType +
        ' - ' +
        fileKey +
        '<br/>' +
        '// Order Id: ' +
        apiHistObj.order_id +
        '<br/>' +
        '// Session Id: ' +
        apiHistObj.session_id +
        '<br/>' +
        '// Service Provider: ' +
        apiHistObj.service_provider +
        '<br/>' +
        '// API Name: ' +
        apiHistObj.api_name +
        '<br/>'

      let formattedData = rawData
      if (rawData.substring(0, 1) === '<') {
        formattedData = rawData.replaceAll('\\"', '"')
        let beginXmlPos = formattedData.indexOf('>') // skip "<?xml...>
        let beginXml = ''
        if (beginXmlPos > 0) {
          beginXml =
            formattedData
              .substring(0, beginXmlPos + 1)
              .replaceAll('<', '&lt;')
              .replaceAll('>', '&gt;') + '<br/>'
          formattedData = formattedData.substring(beginXmlPos + 1)
        }
        formattedData =
          beginXml +
          prettifyXml(formattedData)
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
      } else if (
        rawData.substring(0, 1) === '{' ||
        rawData.substring(0, 1) === '['
      ) {
        formattedData = JSON.stringify(response.data, null, 3)
      }

      let win = window.open('', '_blank')
      win.document.write(
        '<big><pre>' + fileDescription + formattedData + '</pre></big>',
      )
      win.focus()

      let a = document.createElement('a')
      a.href = 'data:application/octet-stream,' + encodeURI(rawData)
      a.download = fileKey.replace('/', '_')
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      let a = document.createElement('a')
      let blob = new Blob([response.data])
      a.href = window.URL.createObjectURL(blob)
      a.download = fileKey.replace('/', '_') + '.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

    setWaitMode('')
  }

  // fileKeys = comma delimited list of names
  const handleDownloadMultipleHistoryFilesAsZip = async (apiHistObj) => {
    let fileKeys = ''

    if (apiHistObj == null) {
      setWaitMode('ZIPALL')
      let elements = data // get setData() value - a list of API History objects from the lookup
      for (let i = 0; i < elements.length; i++) {
        fileKeys +=
          (fileKeys === '' ? '' : ',') +
          elements[i].request_file_name +
          ',' +
          elements[i].response_file_name
      }
    } else {
      setWaitMode('DOWNLOAD' + apiHistObj.apihistories_id)
      fileKeys =
        apiHistObj.request_file_name + ',' + apiHistObj.response_file_name
    }
    console.log('FileKeys:\n' + fileKeys.replaceAll(',', '\n\n') + ':')

    let fileNamePrefix =
      'API_HISTORY_' +
      new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')

    let error = null

    const response = await axios({
      url: env.api.apiHistoryDownload,
      method: 'POST',
      responseType: 'blob',
      params: {
        isZipFile: true,
        fileNamePrefix: fileNamePrefix,
      },
      data: {
        ids: fileKeys,
      },
    }).catch((err) => {
      error = err
    })

    if (error !== null) {
      console.log(error.message)
      alert('Request cannot be completed.')
      setWaitMode('')
      return
    }

    let a = document.createElement('a')
    let blob = new Blob([response.data])
    a.href = window.URL.createObjectURL(blob)
    a.download = fileNamePrefix + '.zip'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setWaitMode('')
  }

  const timeRangeOptions = [
    { value: '', label: '' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: '1m', label: 'Last minute' },
    { value: '5m', label: 'Last 5 minutes' },
    { value: '10m', label: 'Last 10 minutes' },
    { value: '15m', label: 'Last 15 minutes' },
    { value: '30m', label: 'Last 30 minutes' },
    { value: '1h', label: 'Last hour' },
    { value: '24h', label: 'Last 24 hours' },
    { value: '1M', label: 'Last month' },
    { value: '2M', label: 'Last 2 months' },
    { value: '3M', label: 'Last 3 months' },
  ]

  const getTimeRangeOptions = () => {
    let timeRangeOptionsAll = timeRangeOptions

    let addtionalOpts = null
    try {
      addtionalOpts = env.timeRangeOptions
    } catch (e) {
      addtionalOpts = null
    }

    if (
      addtionalOpts !== undefined &&
      addtionalOpts !== null &&
      addtionalOpts.length > 0
    ) {
      for (let i = 0; i < addtionalOpts.length; i++) {
        timeRangeOptionsAll.push(addtionalOpts[i])
      }
    }
    return timeRangeOptionsAll
  }

  // return adjustedDt (start, end)
  const resetStartEndDates = (timeRangeOpt) => {
    let offset = 0
    let interval = ''
    let adjustedDt = {}

    if (
      typeof timeRangeOpt === 'string' &&
      timeRangeOpt !== null &&
      timeRangeOpt !== ''
    ) {
      let number = parseInt(timeRangeOpt, 10)
      interval = timeRangeOpt.substring(timeRangeOpt.length - 1)

      switch (interval) {
        case 'm':
          offset = number * 60 * 1000
          break
        case 'h':
          offset = number * 3600 * 1000
          break
        case 'w':
          offset = number * 7
          break
        case 'M':
          offset = number
          break
        case 'Y':
          offset = number
          break
        default:
      }
    }

    let rightnow = new Date()
    let tzoffset = 1000 * 60 * rightnow.getTimezoneOffset()

    if (timeRangeOpt === 'yesterday') {
      rightnow = new Date()
      rightnow.setDate(rightnow.getDate() - 1)
      rightnow.setHours(23, 59, 59, 999)
      rightnow = new Date(rightnow.getTime() - tzoffset)
    } else {
      rightnow = new Date(rightnow.getTime() - tzoffset)
    }

    adjustedDt.end = rightnow.toISOString().slice(0, -1)

    let ed = Date.parse(adjustedDt.end) // millis
    let edWithMaxOffset = adjustTZOffset(new Date(ed - tzoffset), tzoffset)
    adjustedDt.end = edWithMaxOffset.toISOString().slice(0, -1)

    setEndDate(adjustedDt.end)
    setGmtEndDate(convertDateToGMT(adjustedDt.end))

    if (timeRangeOpt === 'yesterday') {
      let startOfDay = new Date()
      startOfDay.setDate(startOfDay.getDate() - 1)
      startOfDay.setHours(0, 0, 0, 0)
      rightnow = new Date(startOfDay.getTime() - tzoffset)
    } else if (timeRangeOpt === 'today') {
      let startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      rightnow = new Date(startOfDay.getTime() - tzoffset)
      //} else if (timeRangeOpt === 'default') {
      //rightnow = subtractTimeRangeOffset(rightnow)
    } else if (interval === 'w') {
      rightnow.setDate(rightnow.getDate() - offset)
    } else if (interval === 'M') {
      rightnow.setMonth(rightnow.getMonth() - offset)
    } else if (interval === 'Y') {
      rightnow.setFullYear(rightnow.getFullYear() - offset)
    } else {
      rightnow.setTime(rightnow.getTime() - offset)
    }

    adjustedDt.start = rightnow.toISOString().slice(0, -1)

    let sd = Date.parse(adjustedDt.start) // millis
    let sdWithMaxOffset = adjustTZOffset(new Date(sd - tzoffset), tzoffset)
    adjustedDt.start = sdWithMaxOffset.toISOString().slice(0, -1)

    setStartDate(adjustedDt.start)
    setGmtStartDate(convertDateToGMT(adjustedDt.start))

    if (timeRangeOpt === '') {
      resetStartDate()
      resetEndDate()
    }

    return adjustedDt
  }

  /*const getSelectedTimeRangeLabel = () => {
    let trOptions = getTimeRangeOptions()
    let timeRangeLabel = ''
    for (let i = 0; i < trOptions.length; i++) {
      if (trOptions[i].value === timeRange) {
        timeRangeLabel = trOptions[i].label
        break
      }
    }

    return timeRangeLabel
  }*/

  return (
    <>
      <SectionHeader pageHeading="API History Lookup" />
      <Layout.Body data-testid="homePage" includeRail>
        <Card>
          <GridContainer spacing="dense" noWrap>
            <GridItem>
              <Anchor
                onClick={(e) => {
                  resetStartDate()
                }}
              >
                <span className="msg">
                  Reset Start Date
                  <br />
                  &nbsp;
                </span>
              </Anchor>
            </GridItem>
            <GridItem>
              <Anchor
                onClick={(e) => {
                  resetEndDate()
                }}
              >
                <span className="msg">
                  Reset End Date
                  <br />
                  &nbsp;
                </span>
              </Anchor>
            </GridItem>
          </GridContainer>
        </Card>

        <Card>
          <Form onSubmit={handleSubmit}>
            <GridContainer spacing="dense" /*noWrap*/>
              <GridItem>
                <Form.Field
                  className="table-header"
                  id="time_range"
                  type="select"
                  label="Time Range"
                  value={timeRange}
                  defaultValue=""
                  options={getTimeRangeOptions()}
                  onChange={(e) => {
                    let opt = getTimeRangeOptions()[e.target.value].value
                    setTimeRange(opt)
                    resetStartEndDates(opt)
                    setResetStartEndDateOnSearch(true)
                  }}
                />
              </GridItem>
              <GridItem>
                <Form.Field
                  className="table-header"
                  id="start_date"
                  label="Start Date"
                  value={startDate}
                  type="datetime-local"
                  onChange={(e) => {
                    setStartDate(e.target.value)
                    setGmtStartDate(convertDateToGMT(e.target.value))
                    setTimeRange('')
                    setResetStartEndDateOnSearch(false)
                  }}
                />
              </GridItem>
              <GridItem>
                <Form.Field
                  className="table-header"
                  id="end_date"
                  label="End Date"
                  value={endDate}
                  type="datetime-local"
                  onChange={(e) => {
                    setEndDate(e.target.value)
                    setGmtEndDate(convertDateToGMT(e.target.value))
                    setTimeRange('')
                    setResetStartEndDateOnSearch(false)
                  }}
                />
              </GridItem>
              <GridItem>
                <Form.Field
                  id="order_id"
                  label="Order Id"
                  placeholder={orderId}
                  type="text"
                  className="hc-fs-heading4 table-header"
                  style={{ border: '' }}
                  onChange={(e) => {
                    setOrderId(e.target.value)
                  }}
                />
              </GridItem>
              <GridItem>
                <Form.Field
                  id="session_id"
                  label="Session Id"
                  placeholder={sessionId}
                  type="text"
                  className="hc-fs-heading4 table-header"
                  style={{ border: '' }}
                  onChange={(e) => {
                    setSessionId(e.target.value)
                  }}
                />
              </GridItem>
              <GridItem>
                <Form.Field
                  id="service_provider"
                  label="Service Provider"
                  placeholder={serviceProvider}
                  type="text"
                  className="hc-fs-heading4 table-header"
                  style={{ border: '' }}
                  onChange={(e) => {
                    setServiceProvider(e.target.value)
                  }}
                />
              </GridItem>
              <GridItem>
                <Form.Field
                  id="api_name"
                  label="API Name"
                  placeholder={apiName}
                  type="text"
                  className="hc-fs-heading4 table-header"
                  style={{ border: '' }}
                  onChange={(e) => {
                    setApiName(e.target.value)
                  }}
                />
              </GridItem>
              <GridItem>
                <Form.Field
                  id="store_id"
                  label="Store Id"
                  placeholder={storeId}
                  type="text"
                  className="hc-fs-heading4 table-header"
                  style={{ border: '' }}
                  onChange={(e) => {
                    setStoreId(e.target.value)
                  }}
                />
              </GridItem>
              <GridItem>
                <Form.Field
                  id="client_reference_id"
                  label="Client Reference Id"
                  placeholder={clientReferenceId}
                  type="text"
                  className="hc-fs-heading4 table-header"
                  style={{ border: '' }}
                  onChange={(e) => {
                    setClientReferenceId(e.target.value)
                  }}
                />
              </GridItem>
            </GridContainer>
            <GridContainer justify="center">
              <GridItem>
                <Button type="primary" type="submit">
                  Submit
                </Button>
                <br />
                <br />
              </GridItem>
              <GridItem>
                {waitMode === '' && totalElements === 0 ? (
                  <span className="msg">
                    NO API HISTORY RECORDS FOUND FOR THIS CRITERIA
                  </span>
                ) : waitMode === '' && totalElements > 1 ? (
                  <Anchor
                    onClick={(e) => {
                      handleDownloadMultipleHistoryFilesAsZip(null)
                    }}
                  >
                    <span className="msg">
                      DOWNLOAD API HISTORY FILES FOR ALL {data.length} ITEMS ON
                      THE PAGE
                    </span>
                  </Anchor>
                ) : waitMode === 'ZIPALL' ? (
                  <>
                    <div className="wait-msg inline-div">
                      Downloading API History files.. Please wait ..
                    </div>
                  </>
                ) : null}
              </GridItem>
              {waitMode === 'ZIPALL' || waitMode === 'SEARCH' ? (
                <>
                  <GridItem>
                    <div className="loader" />
                  </GridItem>
                </>
              ) : null}
            </GridContainer>
          </Form>
        </Card>
        <Card>
          <Table name="API History Results" alternateRowColor="true">
            <TableHead>
              <TableRow>
                <TableHeader xs className="table-header">
                  Order Id
                </TableHeader>
                <TableHeader xs className="table-header">
                  Session Id
                </TableHeader>
                <TableHeader xs className="table-header">
                  Service Provider
                </TableHeader>
                <TableHeader xs className="table-header">
                  API Name
                </TableHeader>
                <TableHeader xs className="table-header">
                  Download
                </TableHeader>
                <TableHeader xs className="table-header">
                  Request Time
                </TableHeader>
                <TableHeader xs className="table-header">
                  Request File
                </TableHeader>
                <TableHeader xs className="table-header">
                  Response Time
                </TableHeader>
                <TableHeader xs className="table-header">
                  Response File
                </TableHeader>
                <TableHeader xs className="table-header">
                  Is Success
                </TableHeader>
                <TableHeader xs className="table-header">
                  Store
                </TableHeader>
                <TableHeader xs className="table-header">
                  Error Code
                </TableHeader>
                <TableHeader xs className="table-header">
                  Client Reference Id
                </TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {typeof data !== 'undefined' &&
                data.map((s) => {
                  return (
                    <TableRow key={s.apihistories_id}>
                      <TableData xs>{s.order_id}</TableData>
                      <TableData xs>{s.session_id}</TableData>
                      <TableData xs>{s.service_provider}</TableData>
                      <TableData xs>{s.api_name}</TableData>
                      <TableData xs>
                        {s.request_file_name === null &&
                        s.response_file_name === null ? (
                          'Not available'
                        ) : (
                          <Anchor
                            onClick={(e) => {
                              handleDownloadMultipleHistoryFilesAsZip(s)
                            }}
                          >
                            Download
                          </Anchor>
                        )}
                        {waitMode === 'DOWNLOAD' + s.apihistories_id ? (
                          <div className="loader" />
                        ) : null}
                      </TableData>
                      <TableData xs>
                        {new Date(s.request_micro_time).toLocaleString()}
                      </TableData>
                      <TableData xs>
                        {s.request_file_name === null ? (
                          'Not available'
                        ) : (
                          <Anchor
                            onClick={(e) => {
                              handleDownloadHistoryFile(
                                s.request_file_name,
                                s,
                                'Request',
                                false,
                              )
                            }}
                          >
                            Request File
                          </Anchor>
                        )}
                        {waitMode === 'Request' + s.apihistories_id ? (
                          <div className="loader" />
                        ) : null}
                      </TableData>
                      <TableData xs>
                        {new Date(s.response_micro_time).toLocaleString()}
                      </TableData>
                      <TableData xs>
                        {s.response_file_name === null ? (
                          'Not available'
                        ) : (
                          <Anchor
                            onClick={(e) => {
                              handleDownloadHistoryFile(
                                s.response_file_name,
                                s,
                                'Response',
                                false,
                              )
                            }}
                          >
                            Response File
                          </Anchor>
                        )}
                        {waitMode === 'Response' + s.apihistories_id ? (
                          <div className="loader" />
                        ) : null}
                      </TableData>
                      <TableData xs>{s.is_success}</TableData>
                      <TableData xs>{s.store_id}</TableData>
                      <TableData xs>{s.http_response}</TableData>
                      <TableData xs>{s.client_reference_id}</TableData>
                    </TableRow>
                  )
                })}
              <TableRow justify="center">
                <TableData>
                  {pageNumber > 0 ? (
                    <Anchor
                      onClick={(e) => {
                        retrieveHistoryPage(e, 0, 'FIRST')
                      }}
                    >
                      <span className="msg">&lt;&lt;&nbsp;FIRST</span>
                    </Anchor>
                  ) : null}
                  {waitMode === 'FIRST' ? <div className="loader" /> : null}
                </TableData>
                <TableData>
                  {pageNumber > 0 ? (
                    <Anchor
                      onClick={(e) => {
                        retrieveHistoryPage(e, pageNumber - 1, 'PREVIOUS')
                      }}
                    >
                      <span className="msg">&lt;&nbsp;PREVIOUS</span>
                    </Anchor>
                  ) : null}
                  {waitMode === 'PREVIOUS' ? <div className="loader" /> : null}
                </TableData>
                <TableData>
                  {getTotalPageCount() > 0 ? (
                    <span className="msg">
                      Page {pageNumber + 1} of {getTotalPageCount()} --{' '}
                      {totalElements} records total
                    </span>
                  ) : null}
                </TableData>
                <TableData>
                  {pageNumber < getTotalPageCount() - 1 ? (
                    <Anchor
                      onClick={(e) => {
                        retrieveHistoryPage(e, pageNumber + 1, 'NEXT')
                      }}
                    >
                      <span className="msg">NEXT&nbsp;&gt;</span>
                    </Anchor>
                  ) : null}
                  {waitMode === 'NEXT' ? <div className="loader" /> : null}
                </TableData>
                <TableData>
                  {pageNumber < getTotalPageCount() - 1 ? (
                    <Anchor
                      onClick={(e) => {
                        retrieveHistoryPage(e, getTotalPageCount() - 1, 'LAST')
                      }}
                    >
                      <span className="msg">LAST&nbsp;&gt;&gt;</span>
                    </Anchor>
                  ) : null}
                  {waitMode === 'LAST' ? <div className="loader" /> : null}
                </TableData>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </Layout.Body>
    </>
  )
}
