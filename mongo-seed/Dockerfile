FROM mongo

COPY *.json /
CMD mongoimport --host mongo --db ff --collection categories --type json --drop --file /categories.json --jsonArray && mongoimport --host mongo --db ff --collection products --type json --drop --file /products.json --jsonArray