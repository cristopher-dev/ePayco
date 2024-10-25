# ePayco - Backend

Este proyecto es una implementación de una billetera virtual. La aplicación permite registrar clientes, recargar saldo, realizar pagos con confirmación y consultar el saldo actual en la billetera.

## Descripción

El sistema simula el funcionamiento de una billetera virtual a través de servicios **SOAP** y **REST**. El servicio **SOAP** gestiona el acceso a la base de datos, mientras que el servicio **REST** funciona como un intermediario entre el cliente y el servicio SOAP, facilitando la comunicación y manteniendo la seguridad de los datos.

## Funcionalidades

1. **Registro de Clientes**:  
   Permite registrar un cliente enviando los siguientes datos obligatorios:
   - Documento de identidad
   - Nombre completo
   - Email
   - Número de celular

2. **Recarga de Billetera**:  
   Permite cargar saldo a la billetera del cliente mediante:
   - Documento de identidad
   - Número de celular
   - Valor de recarga

3. **Pago con Confirmación**:
   - Se puede realizar una compra siempre y cuando el cliente tenga saldo suficiente.
   - Se genera un token de 6 dígitos para confirmar la transacción, el cual se envía al email del cliente.
   - La confirmación requiere el **ID de sesión** y el **token** para validar la transacción.

4. **Confirmación de Pago**:
   - Valida el ID de sesión y el token enviados al cliente.
   - Si son correctos, se descuenta el saldo y se genera una respuesta de éxito o fallo.

5. **Consulta de Saldo**:
   - Permite consultar el saldo enviando el documento de identidad y el número de celular.

## Estructura de Respuestas

Todas las respuestas de los servicios (SOAP y REST) siguen la misma estructura para facilitar el consumo y la integración:

```json
{
  "success": true | false,
  "cod_error": "00" | "Código de error",
  "message_error": "Mensaje explicativo",
  "data": [ // Array u objeto con la información de respuesta ]
}
