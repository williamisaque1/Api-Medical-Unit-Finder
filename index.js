const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const { json } = require("express");
app.use(express.json());
require("dotenv").config();
app.get("/", async (req, res) => {
  console.log("iniciad");
  let results = await axios.get(
    "https://maps.googleapis.com/maps/api/place/textsearch/json?location=-23.0101811%2C-45.5583074&query=cardiologista&key=AIzaSyA1p_fKTIVgZJ2yF5FkJEEE0uGp-Jo7nnI"
  );
  //console.log(results.data);
  //res.send("seja bem vindo");
  let resultado = [];
  const siglasEstados = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];
  for (let element = 0; element < results.data.results.length; element++) {
    let base = results.data.results[element].formatted_address;
    let end = results.data.results[element].formatted_address.split(",");
    let en = "erro";
    let rua = "erro";
    let n = "erro";
    let bairro = "erro";

    if (end[0].slice(0, 1).includes("R")) {
      if (
        base.indexOf("sala") == -1 &&
        (base.indexOf("Andar") == -1 || base.indexOf("andar") == -1)
      ) {
        if (end[0].slice(0, 2) == "R.") {
          //console.log(end[0].slice(0, 2) + "|" + end[0]);
          //end[1].indexOf("-") != -1

          // if(end[1].slice(end[1].indexOf("-") + 1, end[1].length).trim().slice(0,1))
          var reg = /[A-Z]+/i;
          bairro = reg.test(n);
          console.log(reg.test(n));
          rua = end[0];
          n = end[1].slice(0, end[1].indexOf("-")).trim();
          bairro = end[1].slice(end[1].indexOf("-") + 1, end[1].length).trim();
        } else {
          console.log(
            "algo tem .",
            end[2].slice(0, end[2].indexOf("-")).trim()
          );
          if (base.includes("R.") && base.includes("R")) {
            for (let index = 0; index < siglasEstados.length; index++) {
              let aux = base.slice(
                base.indexOf("-") + 1,
                base.indexOf(siglasEstados[index])
              );

              if (base.indexOf(siglasEstados[index]) != -1) {
                bairro = aux.slice(0, aux.indexOf(",")).trim();
                let baseN = base.slice(
                  base.indexOf(aux) - 10,
                  base.indexOf("-")
                );
                console.log("base n", baseN);
                console.log(baseN.slice(baseN.indexOf(",") + 1).trim());
                rua = end[1];
                n = baseN.slice(baseN.indexOf(",") + 1).trim();

                console.log("aux", aux);
                console.log("base ", base);
              }
            }
          }
        }
        // console.log((base.indexOf("sala") != -1) + "|" + base);
      } else if (
        base.indexOf("sala") != -1 &&
        (base.indexOf("andar") != -1 || base.indexOf("Andar") != -1)
      ) {
        console.log(
          "$$$" +
            base
              .slice(base.indexOf("sala") + 8, base.indexOf("sala") + 9)
              .includes("-")
        );
        if (
          base
            .slice(base.indexOf("sala") + 8, base.indexOf("sala") + 9)
            .includes("-") == true
        ) {
          rua = end[0];
          bairro = base
            .slice(
              base.indexOf("-", base.indexOf("sala")) + 1,
              base.indexOf(",", base.indexOf("sala"))
            )
            .trim();
          n = base.slice(base.indexOf(",") + 1, base.indexOf("-")).trim();
          console.log(
            "sala" +
              results.data.results[element].name +
              "|" +
              base
                .slice(
                  base.indexOf("-", base.indexOf("sala")) + 1,
                  base.indexOf(",", base.indexOf("sala"))
                )
                .trim()
          );
        } else if (
          base
            .slice(base.indexOf("sala") + 8, base.indexOf("sala") + 9)
            .includes("") == true
        ) {
          rua = end[0];
          bairro = base
            .slice(
              base.indexOf("sala") + 9,
              base.indexOf("-", base.indexOf("sala"))
            )
            .trim();
          console.log(
            "sala" +
              results.data.results[element].name +
              "|" +
              base
                .slice(
                  base.indexOf("sala") + 9,
                  base.indexOf("-", base.indexOf("sala"))
                )
                .trim()
          );
          n = base.slice(base.indexOf(",") + 1, base.indexOf("-")).trim();
        }
      }

      // en = "rua";
    } else if (end[0].slice(0, 3).includes("Av.")) {
      for (let index = 0; index < siglasEstados.length; index++) {
        let aux = base.slice(
          base.indexOf("-") + 1,
          base.indexOf(siglasEstados[index])
        );

        if (base.indexOf(siglasEstados[index]) != -1) {
          if (aux.indexOf("sala") != -1) {
            console.log(
              "numero",
              aux.slice(aux.indexOf("-") + 1, aux.indexOf(",")).trim()
            );
            rua = end[0];
            bairro = aux.slice(aux.indexOf("-") + 1, aux.indexOf(",")).trim();
            n = end[1].slice(0, 4).trim();
          } else {
            console.log(
              "auxiliar avenida",
              base
                .slice(base.indexOf(aux) - 6, base.indexOf(aux) - 1)
                .replace(",", "")
                .trim()
            );
            bairro = aux.slice(0, aux.indexOf(",")).trim();
            n = base
              .slice(base.indexOf(aux) - 6, base.indexOf(aux) - 1)
              .replace(",", "")
              .trim();
            rua = end[0];
          }
        }

        en = "avenida";
      }
    } else if (
      end[0].slice(0, 1).includes("A") == false &&
      end[0].slice(0, 1).includes("R") == false
    ) {
      en = "numero";
    }
    //isNaN(end[0].slice(0, 1) )

    resultado.push({
      nomeFantasia: results.data.results[element].name,
      avaliação: results.data.results[element].rating,
      endereco: results.data.results[element].formatted_address, //end[2].indexOf("^[0-9]/g"),
      latitude: results.data.results[element].geometry.location.lat,
      longitude: results.data.results[element].geometry.location.lng,
      rua: rua,
      numero: n,
      bairro: bairro,
    });
  }
  res.status(200).json(resultado);
});
app.post("/cordenadas", async (req, res) => {
  console.time("tempo");
  let arraydeinformacoes = [];
  let endereco = [];
  console.log(req.body.km);
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
    console.log(err);
    res.status(403).send(`erro ocorrido durante a solicao dos dados:\n ${err}`);
  }
});

app.listen(process.env.PORT || "8000", () => {
  console.log("server iniciado na porta 8000");
});
