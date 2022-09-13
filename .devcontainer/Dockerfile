FROM ghcr.io/xu-cheng/texlive-full:20220901
WORKDIR /doc
RUN apk add --no-cache \
    make=4.3-r0 \
    && rm -rf /var/cache/apk/*
CMD [ "/bin/sh" ]
