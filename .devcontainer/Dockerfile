FROM ghcr.io/xu-cheng/texlive-full:20230301
WORKDIR /doc
RUN apk update \
    && apk add git make \
    && rm -rf /var/cache/apk/*
CMD [ "/bin/sh" ]
