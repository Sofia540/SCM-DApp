// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.5.16;

contract Universidades {

    address payable private dirMin = 0xA4E08Db122c1edCA740058bf2b4b3e1A5386e301; // direccion de la cartera del Ministerio

    struct Universidad {
        uint id; // identificador de la universidad en el contrato
        string name; // nombre de la universidad
        address payable dir; // direccion de la cartera de la universidad
        string estado; // estado de la universidad (ALTA o BAJA)
    }

    // Read/write universidades
    mapping(uint => Universidad) public universidades;

    // Contador de universidades
     uint public contadorUniv;

    // Funcion para añadir universidades al contrato. Solo disponible para el Ministerio
    function addUniv(string memory _name, address payable _dir) private {

        require(msg.sender == dirMin);
        contadorUniv ++;
        universidades[contadorUniv] = Universidad(contadorUniv, _name, _dir, "ALTA");

    }

    // Constructor que se llama cuando se despliega el contrato
    constructor() public {

        addUniv("UIB", 0x6B02a40Fb83a7Eff1FAf47Faae41f7168F457CEd);
        addUniv("UNED", 0x480e0A82818eD7b9258971222D544d36d97bba97);
        addUniv("UOC", 0x78f8a958d259d27341952825A40506a90867a299);

    }

    // Funcion para cambiar el estado de una universidad a "ALTA". Solo disponible para el Ministerio
    function darAlta(uint _id) public {

        require(msg.sender == dirMin);

        universidades[_id].estado = "ALTA";
    }

    // Funcion para cambiar el estado de una universidad a "BAJA". Solo disponible para el Ministerio
    function darBaja(uint _id) public {

        require(msg.sender == dirMin);

        universidades[_id].estado = "BAJA";

    }
}