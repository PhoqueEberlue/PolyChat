const db_controller = require('./DB_Controller.js');

(async () => {
    const controller = new db_controller.DB_Controller();
    await controller.initDBConnection();

    await controller.createUser("RISITAS", "issou");
    await controller.createUser("Melenchon", "LAREPUBLIQUECESTMOI");
    await controller.createUser("CACADETRUIRE", "cacadetruire");
    console.log(`check cacadetruire pwd: ${await controller.checkCredentialsUser("CACADETRUIRE", "cacadetruire")}`);
    console.log(`check cacadetruire with wrong pwd: ${await controller.checkCredentialsUser("CACADETRUIRE", "cacadetru1re")}`);
    await controller.createChannel("Qui pour planifier l'union de la gauche ?", "Melenchon");
    await controller.createChannel("Je suis pompier, posez moi des questions", "CACADETRUIRE");
    await controller.createChannel("Je suis femme de maison, posez moi des questions", "CACADETRUIRE");
    await controller.createChannel("Je suis cuisinier, posez moi des questions", "CACADETRUIRE");
    await controller.createChannel("Je suis astronaute, posez moi des questions", "CACADETRUIRE");
    await controller.createChannel("Je suis gendarme, posez moi des questions", "CACADETRUIRE");
    await controller.createChannel("Je suis instituteur, posez moi des questions", "CACADETRUIRE");
    await controller.addUserInChannel(1, "RISITAS", false);
    await controller.createMessage(1, "RISITAS", "Issou");
    await controller.removeUserFromChannel(1, 'RISITAS', "Melenchon");
    await controller.getChannelsOfUser("CACADETRUIRE");
})();
