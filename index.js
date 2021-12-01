const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const { json } = require("express");
app.use(express.json());
require("dotenv").config();
app.get("/", async (req, res) => {
  // const { latitude, longitude } = req.body.origin;
  //const { km } = req.body.km;
  //const especialidade = req.body.especialidade;
  console.log("iniciad");
  // console.log("essa e a resposta do usuario:", especialidade);
  //cardiologista
  let results = await axios.get(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?location=-23.0101811%2C-45.5583074&query=clinico&key=${process.env.GOOGLE_API_KEY}`
  );
  //console.log(results.data);
  //res.send("seja bem vindo");
  let resultado = [];
  var km = 3000;
  /* function getDistanceFromLatLonInKm(position1, position2) {
    "use strict";
    var deg2rad = function (deg) {
        return deg * (Math.PI / 180);
      },
      R = 6371,
      dLat = deg2rad(position2.lat - position1.lat),
      dLng = deg2rad(position2.lng - position1.lng),
      a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(position1.lat)) *
          Math.cos(deg2rad(position1.lat)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2),
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c * 1000).toFixed();
  }*/

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
  /*
  async function loadData() {
    let data = [];
    for (let element = 0; element < results.data.results.length; element++) {
      data.push(
        axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?fields=name,address_components,formatted_phone_number,opening_hours&place_id=${results.data.results[element].place_id}&key=${process.env.GOOGLE_API_KEY}`
        )
      );
    }
    console.log("sdss0", data);
    return data;
  }

  Promise.all(await loadData()).then((value) => {
    console.log("places  ", value.length);

    value.forEach((element, index) => {
      /* console.log(
        "places id ",
        element.data.result.opening_hours?.weekday_text
      );

      console.log(
        "places id ",
        element.data.result.address_components.length +
          " " +
          JSON.stringify(element.data.result.address_components[1])
      );
    });
  });
  */
  for (let element = 0; element < results.data.results.length; element++) {
    let base = results.data.results[element].formatted_address;
    let end = results.data.results[element].formatted_address.split(",");
    let rua = "erro";
    let n = "erro";
    let bairro = "erro";
    let cidade = "erro";
    /*  var distancia = getDistanceFromLatLonInKm(
      { lat: -23.0101811, lng: -45.5583074 },
      {
        lat: results.data.results[element].geometry.location.lat,
        lng: results.data.results[element].geometry.location.lng,
      }
    );
    console.log("distanciaa " + (distancia / 1000).toFixed(2) + " Km");
  */

    //console.log("qdqd", sequencia(results2).length);

    //console.log(request);
    // console.log((await request[1]).data.results[0].formatted_address);

    // console.log("places id ", results2);
    /*  console.log(
      "urll",
      results.data.results[element].photos?.[0].photo_reference
   );*/
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
          // console.log(reg.test(n));
          rua = end[0];

          n = end[1].slice(0, end[1].indexOf("-")).trim();
          bairro = end[1].slice(end[1].indexOf("-") + 1, end[1].length).trim();
          cidade = end[2];
        } else {
          /* console.log(
            "algo tem .",
            end[2].slice(0, end[2].indexOf("-")).trim()
          );*/
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
                //  console.log("base n", baseN);
                //console.log(baseN.slice(baseN.indexOf(",") + 1).trim());
                rua = end[1];
                n = baseN.slice(baseN.indexOf(",") + 1).trim();
                cidade = end[2];
                //console.log("aux", aux);
                //console.log("base ", base);
              }
            }
          }
        }
        // console.log((base.indexOf("sala") != -1) + "|" + base);
      } else if (
        base.indexOf("sala") != -1 &&
        (base.indexOf("andar") != -1 || base.indexOf("Andar") != -1)
      ) {
        /* console.log(
          "$$$" +
            base
              .slice(base.indexOf("sala") + 8, base.indexOf("sala") + 9)
              .includes("-")
        );*/
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
          /* console.log(
            "sala" +
              results.data.results[element].name +
              "|" +
              base
                .slice(
                  base.indexOf("-", base.indexOf("sala")) + 1,
                  base.indexOf(",", base.indexOf("sala"))
                )
                .trim()
          );*/
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
          cidade = end[2];
          /*  console.log(
            "sala" +
              results.data.results[element].name +
              "|" +
              base
                .slice(
                  base.indexOf("sala") + 9,
                  base.indexOf("-", base.indexOf("sala"))
                )
                .trim()
          );*/
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
            /*  console.log(
              "numero",
              aux.slice(aux.indexOf("-") + 1, aux.indexOf(",")).trim()
            );*/
            rua = end[0];
            bairro = aux.slice(aux.indexOf("-") + 1, aux.indexOf(",")).trim();
            n = end[1].slice(0, 4).trim();
            cidade = end[2];
          } else {
            /* console.log(
              "auxiliar avenida",
              base
                .slice(base.indexOf(aux) - 6, base.indexOf(aux) - 1)
                .replace(",", "")
                .trim()
            );*/
            bairro = aux.slice(0, aux.indexOf(",")).trim();
            n = base
              .slice(base.indexOf(aux) - 6, base.indexOf(aux) - 1)
              .replace(",", "")
              .trim();
            rua = end[0];
            cidade = end[2];
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
      lat: results.data.results[element].geometry.location.lat,
      long: results.data.results[element].geometry.location.lng,
      rua: rua,
      numero: n,
      bairro: bairro,
      cidade: cidade,
      horarioFuncionamento:
        results.data.results[element].opening_hours?.open_now != undefined
          ? results.data.results[element].opening_hours?.open_now
          : "erro",
      urlFoto:
        results.data.results[element].photos?.[0].photo_reference != undefined
          ? results.data.results[element].photos[0].photo_reference
          : "erro",
      places_id: results.data.results[element].place_id,
    });
  }

  async function loadData() {
    let data = [];
    let origin = { latitude: -23.0101811, longitude: -45.5583074 };
    for (let element = 0; element < results.data.results.length; element++) {
      /* console.log(
        resultado[element].endereco
          .replaceAll(",", "")
          .replaceAll("-", "")
          .replaceAll(".", "") +
          "|" +
          resultado[element].long
      );*/
      data.push(
        axios.get(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${resultado[element].lat},${resultado[element].long}&key=${process.env.GOOGLE_API_KEY}`
        )
      );
    }
    console.log("sdss0", data);
    return data;
  }
  var arraydistancia = [];

  Promise.all(await loadData())
    .then((value) => {
      console.log("places  ", value.length);

      value.forEach((element, index) => {
        //  console.log(element.data.routes[0].legs[0].distance);
        if (km >= element.data.routes[0].legs[0].distance.value) {
          arraydistancia.push({
            id: index,
            texto: element.data.routes[0].legs[0].distance.value,
          });
        }
      });

      console.log(arraydistancia);
      arraydistancia = arraydistancia.sort((a, b) => a.texto - b.texto);
      console.log(arraydistancia);
      let i = 0;
      let j = 0;
      var resultado2 = [];
      console.log(resultado[0].nomeFantasia);
      var u = setInterval(() => {
        if (i < resultado.length) {
          if (arraydistancia[j]?.id == i) {
            console.log(
              arraydistancia[j].texto + "|" + resultado[i].nomeFantasia
            );
            resultado2.push(resultado[i]);
          }
          i++;
        } else {
          if (j < resultado.length - 1) {
            j++;
            i = 0;
          } else {
            clearInterval(u);
            res.status(200).json(resultado2);
          }
        }
      });
    })
    .catch((e) => {
      res.status(404).send("erro");
    });
});

///////////////////////////////////////////////////////
app.post("/detalhamento", async (req, res) => {
  var resultado = [];
  const places_id = req.body.places_id;
  console.log("places id com numero ", places_id);

  const detalhes = await axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json?fields=name,address_components,formatted_phone_number,opening_hours&place_id=${places_id}&key=${process.env.GOOGLE_API_KEY}`
  );
  // console.log("conteudoooo", detalhes.data);

  for (
    var i = 0;
    i < detalhes.data.result.opening_hours?.weekday_text.length;
    i++
  ) {
    var busca = detalhes.data.result.opening_hours?.weekday_text[i];
    console.log("des", busca);

    for (var index = 7; index < busca.length; index++) {
      if (
        detalhes.data.result.opening_hours?.weekday_text[i].includes("Closed")
      ) {
        busca = detalhes.data.result.opening_hours?.weekday_text[i];
        console.log("fechado");
      }
      if (busca[index] == ":") {
        if (busca.slice(index - 3, index + 6).includes("PM")) {
          let n = busca.slice(index - 2, index + 4).trim();

          let soma = `${
            parseInt(busca.slice(index - 2, index).trim()) + 12
          }${busca.slice(index, index + 4)}`;

          busca = busca.replace(n, soma).trim();
        } else {
          if (busca.slice(index - 5, index).includes("PM")) {
            soma = `${
              parseInt(busca.slice(index - 2, index).trim()) + 12
            }${busca.slice(index, index + 4)}`;
            n = busca.slice(index - 2, index + 4).trim();

            busca = busca.replace(n, soma);
          }
        }
      }
    }
    busca = busca
      .replace("AM", "")
      .replace("PM", "")
      .replace("PM", "")
      .replace("   ", " ");

    resultado.push(
      busca
        .replace("Monday", "Segunda")
        .replace("Closed", "fechado")
        .replace("Tuesday", "Terça")
        .replace("Closed", "fechado")
        .replace("Wednesday", "Quarta")
        .replace("Closed", "fechado")
        .replace("Thursday", "Quinta")
        .replace("Closed", "fechado")
        .replace("Friday", "Sexta")
        .replace("Closed", "fechado")
        .replace("Saturday", "Sábado")
        .replace("Closed", "fechado")
        .replace("Sunday", "Domingo")
        .replace("Closed", "fechado")
    );
  }
  console.log(resultado);
  if (detalhes.data.result.opening_hours?.weekday_text != undefined) {
    detalhes.data.result.opening_hours.weekday_text = resultado;
  }

  res.status(200).json({ detalhes: detalhes.data, status: "ok" });
});
app.get("/detalhamento", async (req, res) => {
  var resultado = [];
  const places_id = req.body.places_id;
  console.log("places id com numero ", places_id);

  const detalhes = await axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json?fields=name,address_components,formatted_phone_number,opening_hours&place_id=ChIJ23jveZT5zJQRyEdWK4i6LQY&key=${process.env.GOOGLE_API_KEY}`
  );
  //const regex = /(([0-2]|0?[1-9]):([0-5][0-9]))/g;
  //var myArray = regex.exec(detalhes.data.result.opening_hours?.weekday_text[0]);
  var contador = 0;
  for (
    var i = 0;
    i < detalhes.data.result.opening_hours?.weekday_text.length;
    i++
  ) {
    var busca = detalhes.data.result.opening_hours?.weekday_text[i];
    console.log("des", busca);

    for (var index = 7; index < busca.length; index++) {
      if (
        detalhes.data.result.opening_hours?.weekday_text[i].includes("Closed")
      ) {
        busca = detalhes.data.result.opening_hours?.weekday_text[i];
        console.log("fechado");
      }
      if (busca[index] == ":") {
        if (i == detalhes.data.result.opening_hours?.weekday_text.length - 3) {
          contador = contador + 1;
        }
        if (busca.slice(index - 3, index + 6).includes("PM")) {
          let n = busca.slice(index - 2, index + 4).trim();

          let soma = `${
            parseInt(busca.slice(index - 2, index).trim()) + 12
          }${busca.slice(index, index + 4)}`;

          busca = busca.replace(n, soma).trim();
        } else {
          if (busca.slice(index - 5, index).includes("PM")) {
            soma = `${
              parseInt(busca.slice(index - 2, index).trim()) + 12
            }${busca.slice(index, index + 4)}`;
            n = busca.slice(index - 2, index + 4).trim();

            busca = busca.replace(n, soma);
          }
        }
      }
    }
    busca = busca
      .replace("AM", "")
      .replace("PM", "")
      .replace("PM", "")
      .replace("   ", " ");

    resultado.push(
      busca
        .replace("Monday", "Segunda")
        .replace("Closed", "fechado")
        .replace("Tuesday", "Terça")
        .replace("Closed", "fechado")
        .replace("Wednesday", "Quarta")
        .replace("Closed", "fechado")
        .replace("Thursday", "Quinta")
        .replace("Closed", "fechado")
        .replace("Friday", "Sexta")
        .replace("Closed", "fechado")
        .replace("Saturday", "Sábado")
        .replace("Closed", "fechado")
        .replace("Sunday", "Domingo")
        .replace("Closed", "fechado")
    );
  }
  console.log(resultado);

  detalhes.data.result.opening_hours.weekday_text = resultado;

  res.status(200).json({ detalhes: detalhes.data, status: "ok" });
});

app.post("/cordenadas", async (req, res) => {
  const { latitude, longitude } = req.body.origin;
  const km = req.body.km;
  const especialidade = req.body.especialidade;
  console.log("coisas" + latitude + "|" + longitude + "|" + km);
  console.log("iniciad");
  console.log("essa e a resposta do usuario:", especialidade);
  //cardiologista
  let results = await axios.get(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?location=-${latitude}%2C${longitude}&query=${especialidade}&radius=${
      km * 1000
    }&key=${process.env.GOOGLE_API_KEY}`
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
    let rua = "erro";
    let n = "erro";
    let bairro = "erro";
    let cidade = "erro";

    /*console.log(
      "urll",
      results.data.results[element].photos?.[0].photo_reference
    );*/
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
          // console.log(reg.test(n));
          rua = end[0];

          n = end[1].slice(0, end[1].indexOf("-")).trim();
          bairro = end[1].slice(end[1].indexOf("-") + 1, end[1].length).trim();
          cidade = end[2];
        } else {
          /* console.log(
            "algo tem .",
            end[2].slice(0, end[2].indexOf("-")).trim()
          );*/
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
                //console.log(baseN.slice(baseN.indexOf(",") + 1).trim());
                rua = end[1];
                n = baseN.slice(baseN.indexOf(",") + 1).trim();
                cidade = end[2];
                //console.log("aux", aux);
                //console.log("base ", base);
              }
            }
          }
        }
        // console.log((base.indexOf("sala") != -1) + "|" + base);
      } else if (
        base.indexOf("sala") != -1 &&
        (base.indexOf("andar") != -1 || base.indexOf("Andar") != -1)
      ) {
        /*   console.log(
          "$$$" +
            base
              .slice(base.indexOf("sala") + 8, base.indexOf("sala") + 9)
              .includes("-")
        );*/
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
          /* console.log(
            "sala" +
              results.data.results[element].name +
              "|" +
              base
                .slice(
                  base.indexOf("-", base.indexOf("sala")) + 1,
                  base.indexOf(",", base.indexOf("sala"))
                )
                .trim()
          );*/
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
          cidade = end[2];
          /*  console.log(
            "sala" +
              results.data.results[element].name +
              "|" +
              base
                .slice(
                  base.indexOf("sala") + 9,
                  base.indexOf("-", base.indexOf("sala"))
                )
                .trim()
          );*/
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
            /* console.log(
              "numero",
              aux.slice(aux.indexOf("-") + 1, aux.indexOf(",")).trim()
            );*/
            rua = end[0];
            bairro = aux.slice(aux.indexOf("-") + 1, aux.indexOf(",")).trim();
            n = end[1].slice(0, 4).trim();
            cidade = end[2];
          } else {
            /* console.log(
              "auxiliar avenida",
              base
                .slice(base.indexOf(aux) - 6, base.indexOf(aux) - 1)
                .replace(",", "")
                .trim()
            );*/
            bairro = aux.slice(0, aux.indexOf(",")).trim();
            n = base
              .slice(base.indexOf(aux) - 6, base.indexOf(aux) - 1)
              .replace(",", "")
              .trim();
            rua = end[0];
            cidade = end[2];
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
      lat: results.data.results[element].geometry.location.lat,
      long: results.data.results[element].geometry.location.lng,
      rua: rua,
      numero: n,
      bairro: bairro,
      cidade: cidade,
      horarioFuncionamento:
        results.data.results[element].opening_hours?.open_now != undefined
          ? results.data.results[element].opening_hours?.open_now
          : "erro",
      urlFoto:
        results.data.results[element].photos?.[0].photo_reference != undefined
          ? results.data.results[element].photos[0].photo_reference
          : "erro",
      places_id: results.data.results[element].place_id,
    });
  }
  async function loadData() {
    let data = [];
    let origin = { latitude: -23.0101811, longitude: -45.5583074 };
    for (let element = 0; element < results.data.results.length; element++) {
      /* console.log(
        resultado[element].endereco
          .replaceAll(",", "")
          .replaceAll("-", "")
          .replaceAll(".", "") +
          "|" +
          resultado[element].long
      );*/
      data.push(
        axios.get(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${latitude},${longitude}&destination=${resultado[element].lat},${resultado[element].long}&key=${process.env.GOOGLE_API_KEY}`
        )
      );
    }
    console.log("sdss0", data);
    return data;
  }
  var arraydistancia = [];

  Promise.all(await loadData())
    .then((value) => {
      console.log("places  ", value.length);
      console.log("dsd", value.data[0]);
      value.forEach((element, index) => {
        console.log(element.data.routes[0].legs[0].distance);
        if (km >= element.data.routes[0].legs[0].distance.value) {
          arraydistancia.push({
            id: index,
            texto: element.data.routes[0].legs[0].distance.value,
          });
        }
      });

      console.log(arraydistancia);
      arraydistancia = arraydistancia.sort((a, b) => a.texto - b.texto);
      console.log(arraydistancia);
      let i = 0;
      let j = 0;
      var resultado2 = [];
      console.log(resultado[0].nomeFantasia);
      var u = setInterval(() => {
        if (i < resultado.length) {
          if (arraydistancia[j]?.id == i) {
            console.log(
              arraydistancia[j].texto + "|" + resultado[i].nomeFantasia
            );
            resultado2.push(resultado[i]);
          }
          i++;
        } else {
          if (j < resultado.length - 1) {
            j++;
            i = 0;
          } else {
            clearInterval(u);
            res.status(200).json(resultado2);
          }
        }
      });
    })
    .catch((e) => {
      res.status(404).send("erro");
    });
});

/*
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
      }

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
*/
app.listen(process.env.PORT || "8000", () => {
  console.log("server iniciado na porta 8000");
});
