# adjust paths for your setup

export FUSEKI_HOME=../../apache-jena-fuseki-2.3.0
export FUSEKI_BASE=../../apache-jena-fuseki-2.3.0

java -Xms2048M -Xmx2048M -Xss4m  -jar ../../apache-jena-fuseki-2.3.0/fuseki-server.jar --verbose --update --config ../data/schemaedit-config.ttl --port=3333

# --pages ../src/public/

# --pages ../jena-fuseki-1.0.0/pages

# -Xss4m is stack

