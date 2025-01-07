FROM denoland/deno:2.1.4

EXPOSE 4000

WORKDIR /app

COPY deps.ts .
RUN deno install --entrypoint deps.ts


COPY . .

RUN deno cache main.ts

CMD ["run", "--allow-net", "main.ts"]