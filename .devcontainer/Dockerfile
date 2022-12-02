FROM ghcr.io/xu-cheng/texlive-full:20221201
WORKDIR /doc
RUN apk update \
    && apk add git make \
    && rm -rf /var/cache/apk/*
CMD [ "/bin/sh" ]
