// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.5.16;

contract Certificados {

    struct Certificado {
        uint id; // identificador del certificado en el contrato
        string did; // DID del certificado
        uint fEmision; // Fecha de emision del certificado
        uint fCaducidad; // Fecha de caducidad del certificado
        string univName; // Universidad que emite el certificado
        uint8[64] firma; // Firma de la universidad, obtenida a partir del cifrado del hash devuelto por IPFS
    }

    // Read/write certificados
    mapping(uint => Certificado) public certificados;

    //Contador de certificados
     uint public contadorCert;

    // Funcion para añadir certificados al contrato
    function addCert(string memory _did, uint8[64] memory _firma, string memory _univName) public {

        uint tActual = block.timestamp;
        uint fCaducidad = tActual + 3 * 365 days; // Caducidad de 3 años para cualquier certificado14
        contadorCert ++;
        certificados[contadorCert] = Certificado(contadorCert, _did, tActual, fCaducidad, _univName, _firma);

    }

    // Funcion para obtener la firma del certificado indicado en la variable de entrada
    function getFirma(uint _id) public view returns(uint8[64] memory){

        return certificados[_id].firma;

    }


    //Constructor que se llama cuando se despliega el contrato
    constructor() public {

        // Se añade un certificado de pruebas emnitido por la UIB con el DID indicado. La clave privada de la UIB es: 147,253 que usa para firmar el hash IPFS 
        addCert("did:tel:3,253#QmUJtBJ3qmjh9sPQKbPEZ2HMeZ46XXDNXjseSyAodwzry3", [37, 166, 11, 118, 226, 16, 186, 194, 207, 183, 58, 207, 58, 121, 93, 207, 16, 183, 43, 118, 37, 194, 226, 37, 11, 122, 123, 123, 194, 123, 183, 11, 93, 166, 43, 93, 183, 183, 58, 121, 207, 93, 194, 93, 93, 43, 123, 194, 166, 58, 122, 43, 226, 186, 121, 123, 37, 37, 58, 37, 121, 226, 37, 207], "UIB");
    }
}