# ePayco - Backend

This project implements a virtual wallet. The application allows clients to register, top up balance, make payments with confirmation, and check the current wallet balance.

## Description

The system simulates the functionality of a virtual wallet through **SOAP** and **REST** services. The **SOAP** service manages database access, while the **REST** service functions as an intermediary between the client and the SOAP service, facilitating communication and maintaining data security.

## Features

1. **Client Registration**:  
   Allows registering a client by sending the following required data:
   - Identity document
   - Full name
   - Email
   - Phone number

2. **Wallet Top-Up**:  
   Allows adding balance to the client’s wallet by providing:
   - Identity document
   - Phone number
   - Top-up amount

3. **Payment with Confirmation**:
   - A purchase can be made as long as the client has sufficient balance.
   - A 6-digit token is generated to confirm the transaction, which is sent to the client’s email.
   - Confirmation requires both the **session ID** and the **token** to validate the transaction.

4. **Payment Confirmation**:
   - Validates the session ID and token sent to the client.
   - If correct, the balance is deducted, and a success or failure response is generated.

5. **Balance Inquiry**:
   - Allows checking the balance by sending the identity document and phone number.

## Response Structure

All responses from the services (SOAP and REST) follow the same structure to facilitate consumption and integration:

```json
{
  "success": true | false,
  "cod_error": "00" | "Error code",
  "message_error": "Descriptive error message",
  "data": [ // Array or object with the response data ]
}
