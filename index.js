const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
app.use(express.json());
require("dotenv").config();
app.get("/", (req, res) => {
  res.send("seja bem vindo");
});
app.post("/cordenadas", async (req, res) => {
  console.time("tempo");
  let arraydeinformacoes = [];
  let endereco = [];
  //console.log(req.body.km);
  const { latitude, longitude } = req.body.origin;
  console.log("resultado " + latitude + "|" + longitude);
  try {
    let informacao = await axios.get(
      `http://mobile-aceite.tcu.gov.br/mapa-da-saude/rest/estabelecimentos/latitude/${latitude}/longitude/${longitude}/raio/${req.body.km}/?categoria=CL%C3%8DNICA`
    );

    arraydeinformacoes = [...informacao.data];
    // console.log(arraydeinformacoes);
    for (let i = 0; i < arraydeinformacoes.length; i++) {
      //console.log(arraydeinformacoes[i]);
      if (
        arraydeinformacoes[i].logradouro ||
        arraydeinformacoes[i].numero ||
        arraydeinformacoes[i].bairro ||
        arraydeinformacoes[i].cidade
      ) {
        endereco.push([
          arraydeinformacoes[i]?.logradouro +
            " " +
            arraydeinformacoes[i]?.numero +
            " " +
            arraydeinformacoes[i]?.bairro +
            " " +
            arraydeinformacoes[i]?.cidade,
        ]);
      }
    }

    function sequencia(n) {
      let numeros = [];

      for (let index = 0; index < n; index++) {
        numeros.push(index);
      }
      return numeros;
    }

    async function loadData(n) {
      const data = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${endereco[n]}&key=${process.env.GOOGLE_API_KEY}`
      );

      return data;
    }
    // console.log(sequencia(endereco.length));
    const request = sequencia(endereco.length).map(loadData);

    // console.log((await request[1]).data.results[0].formatted_address);
    Promise.all(request)
      .then((value) => {
        value.forEach((element, index) => {
          let { lat, lng } = element.data.results[0].geometry.location;

          /*  if (index == 12) {
        console.log(
          "endereco + " +
            endereco[index] +
            JSON.stringify(element.data.results[0].geometry.location)
        );
      }*/

          arraydeinformacoes[index].lat = lat;
          arraydeinformacoes[index].long = lng;
        });
        console.timeEnd("tempo");
        res.send(arraydeinformacoes);
      })
      .catch((err) =>
        res
          .status(403)
          .send(`erro ocorrido durante a solicitação dos dados:\n ${err}`)
      );
  } catch (err) {
    res.status(403).send(`erro ocorrido durante a solicao dos dados:\n ${err}`);
  }
});

app.listen(process.env.PORT || "8000", () => {
  console.log("server iniciado na porta 8000");
});
