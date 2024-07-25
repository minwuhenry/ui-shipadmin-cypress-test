FROM nginx:1.21.0-alpine
RUN echo "http://dl-cdn.alpinelinux.org/alpine/main" >> /etc/apk/repositories && \
  apk upgrade --no-cache --update
# copy application output from `npm run build` into the nginx container
COPY build /usr/share/nginx/html
COPY nginx/ /etc/nginx/conf.d/
WORKDIR /usr/share/nginx/html
# expose our port
EXPOSE 80

# download runtime-connector from artifactory
ENV RUNTIME_VERSION=v2.4.3
RUN apk upgrade --no-cache --update
RUN apk --no-cache add curl
RUN apk --no-cache add tar
WORKDIR /
RUN curl -sk "https://binrepo.minhenry.com/artifactory/platform/runtime-connector/${RUNTIME_VERSION}/runtime-connector-linux-amd64-${RUNTIME_VERSION}.tgz" | tar -C / -xvzf -

# provide runtime configuration
COPY runtime.yml /runtime.yml
# set the container entrypoint to runtime-connector
ENTRYPOINT ["/runtime-connector", "--", "nginx", "-g", "daemon off;"]
