class Animal {
  nome;
  tamanho;
  biomas;
  carnivoro;

  constructor(nome, tamanho, biomas, carnivoro) {
    this.nome = nome;
    this.tamanho = tamanho;
    this.biomas = biomas;
    this.carnivoro = carnivoro;
  }

  calculaEspacoRestante(quantidade, recintoDaVez) {
    let somatorio = 0;
    for (const animal of recintoDaVez.animais) {
      somatorio = somatorio + animal.tamanho;
    }

    for (const animal of recintoDaVez.animais) {
      if(animal.nome != this.nome){
        somatorio = somatorio + 1;
        break;
      }
    }

    return recintoDaVez.tamanho - (quantidade * this.tamanho + somatorio);
  }

  verificaBioma(recintoDaVez) {
    for (const bioma of this.biomas) {
      if (recintoDaVez.biomas.includes(bioma)) {
        return true;
      }
    }

    return false;
  }

  // Um animal se sente confortável se está num bioma adequado e com espaço suficiente para cada indivíduo
  // Quando há mais de uma espécie no mesmo recinto, é preciso considerar 1 espaço extra ocupado
  verificaEspaco(quantidade, recintoConfortavel) {
    //verifica se é da mesma especie

    if(this.calculaEspacoRestante(quantidade, recintoConfortavel) >= 0){
      return true;
    }
    return false;

  }

  //Animais carnívoros devem habitar somente com a própria espécie
  verificaConforto(animalDaVez, recintoDaVez) {
    //verifica se não é carnivoro
    if (!animalDaVez.carnivoro) {
      // se for falso entra no if
      //verifica se o animal que está lá dentro não é carnivoro
      for (const animal of recintoDaVez.animais) {
        if (!animal.carnivoro) {
          return true;
        }
        return false;
      }
      return true;
    }

    //verificando se são da mesma especies
    if (recintoDaVez.animais.includes(animalDaVez) || recintoDaVez.animais.length == 0) {
      return true;
    }
    return false;
  }
}

class Hipopotamo extends Animal {
  constructor(nome, tamanho, bioma, carnivoro) {
    super(nome, tamanho, bioma, carnivoro);
  }

  //Hipopótamo(s) só tolera(m) outras espécies estando num recinto com savana e rio
  verificaTolerancia(recintoDaVez) {
    //savana e rio
    if ( recintoDaVez.biomas.includes(Biomas.RIO) && recintoDaVez.biomas.includes(Biomas.SAVANA)
    ) {
      return true;
    }

    if ( recintoDaVez.animais.includes(Animais.HIPOPOTAMO) || recintoDaVez.animais.length == 0
    ) {
      return true;
    }

    return false;
  }
}

class Macaco extends Animal {
  constructor(nome, tamanho, bioma, carnivoro) {
    super(nome, tamanho, bioma, carnivoro);
  }

  //Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie
  verificaAmigos(recintoDaVez, quantidade) {
    if (quantidade > 1) {
      return true;
    }
    if (recintoDaVez.animais.length > 0) {
      return true;
    }
    return false;
  }
}

class Recinto {
  constructor(id, biomas, tamanho, animais) {
    this.id = id;
    this.biomas = biomas;
    this.tamanho = tamanho;
    this.animais = animais;
  }
}

const Biomas = {
  SAVANA: "Savana",
  FLORESTA: "Floresta",
  RIO: "Rio",
};

const Animais = {
  LEAO: new Animal("LEAO", 3, [Biomas.SAVANA], true),
  LEOPARDO: new Animal("LEOPARDO", 2, [Biomas.SAVANA], true),
  CROCODILO: new Animal("CROCODILO", 3, [Biomas.RIO], true),
  MACACO: new Macaco("MACACO", 1, [Biomas.FLORESTA, Biomas.SAVANA], false),
  GAZELA: new Animal("GAZELA", 2, [Biomas.SAVANA], false),
  HIPOPOTAMO: new Hipopotamo(
    "HIPOPOTAMO",
    4,
    [Biomas.SAVANA, Biomas.RIO],
    false
  ),
};

const Recintos = {
  PRIMEIRO_RECINTO: new Recinto(1, [Biomas.SAVANA], 10, [
    Animais.MACACO,
    Animais.MACACO,
    Animais.MACACO,
  ]),
  SEGUNDO_RECINTO: new Recinto(2, [Biomas.FLORESTA], 5, []),
  TERCEIRO_RECINTO: new Recinto(3, [Biomas.RIO, Biomas.SAVANA], 7, [
    Animais.GAZELA,
  ]),
  QUARTO_RECINTO: new Recinto(4, [Biomas.RIO], 8, []),
  QUINTO_RECINTO: new Recinto(5, [Biomas.SAVANA], 9, [Animais.LEAO]),
};

class RecintosZoo {
  analisaRecintos(animal, quantidade) {
    try {
      if (quantidade <= 0) {
        throw new Error("Quantidade inválida");
      }

      let recintosViaveis = [];
      let resultado = [];
      const animalDaVez = Animais[animal]; //animal passado
      // verifica se não é nenhuma das chaves

      if (animalDaVez == undefined) {
        throw new Error("Animal inválido");
      }

      for (const recintoDaVez of Object.values(Recintos)) {
        //ambiente confortavel

        if (!animalDaVez.verificaBioma(recintoDaVez)) {
          continue;
        }
        //lugares de cabem o abimal
        if (!animalDaVez.verificaEspaco(quantidade, recintoDaVez)) {
          continue;
        }
        if (!animalDaVez.verificaConforto(animalDaVez, recintoDaVez)) {
          continue;
        }
        if (animalDaVez.nome == "HIPOPOTAMO") {
          if (!animalDaVez.verificaTolerancia(recintoDaVez)) {
            continue;
          }
        }

        if (animalDaVez.nome == "MACACO") {
          if (!animalDaVez.verificaAmigos(recintoDaVez, quantidade)) {
            continue;
          }
        }
        recintosViaveis.push(recintoDaVez);
      }


      if (recintosViaveis.length == 0) {
        throw new Error("Não há recinto viável");
      } else {
        for (const aux of recintosViaveis) {
          resultado.push(
            `Recinto ${
              aux.id
            } (espaço livre: ${animalDaVez.calculaEspacoRestante(
              quantidade,
              aux
            )} total: ${aux.tamanho})`
          );
        }
        return { recintosViaveis: resultado };
      }
    } catch (erro) {
      return { erro: erro.message };
    }
  }
}
/*
recintosViaveis: ["Recinto 1 (espaço livre: 5 total: 10)",   
"Recinto 2 (espaço livre: 3 total: 5)",   
"Recinto 3 (espaço livre: 2 total: 7)"]
*/
export { RecintosZoo as RecintosZoo };
