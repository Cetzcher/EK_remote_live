FROM mongo:latest
EXPOSE 27017
ENTRYPOINT ["/usr/bin/mongod"]
CMD ["--quiet"]
