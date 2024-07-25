
 npm run build

 docker build -t ccshipadmin -f Dockerfile .

 tapctl start cluster ccshipadmin-stage ccshipadmin -p 3000
