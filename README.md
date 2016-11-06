flame.furniture
===============

   install dependencies:
     $ cd flame.furniture && npm install

   run the app:
     $ DEBUG=flame.furniture:* npm start

   run the develop app:
     $ DEBUG=flame.furniture:* NODEMAILER_TRANSPORTER=smtps://flamefurniture%40gmail.com:password@smtp.gmail.com MAIL_TO=foo@bar.com nodemon

   contact send test:
     $ curl -i --data "name=Foo&email=foo@bar.com&subject=Test&message=Message" http://localhost:3000/contact/send