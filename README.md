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

Running
-------

    $ docker-compose kill
    $ docker-compose rm -f
    $ docker-compose build
    $ docker-compose up

Log Mongo DB Queries
-----------------

    $ docker exec -it flamefurniture_mongo_1 bash
    $ mongo
    > db.setProfilingLevel(2)
    > db.system.profile.find().pretty()