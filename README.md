Levantamiento del sistema

Construir imágenes y levantar servicios:

docker compose up --build -d licencias portal-paciente validador-aseguradora


Para verificar que los servicios están corriendo:

docker compose ps


Deben aparecer los 3 contenedores en estado running.


Ejecutar las pruebas de consumidores:

docker compose run --rm consumer-tests


Los contratos generados quedarán en la carpeta:

./pacts/*.json

Verificación del proveedor

Ejecutar la verificación de Pact en el servicio Licencias:

docker compose run --rm verify-licencias

Desafios de la actividad

los mayores desafios de esta actividad fueron :

Uso de Pact

El trabajo con Pact resultó dificil, especialmente al inicio, implicó comprender la dinámica de Consumer-Driven Contracts y la correcta configuración de los tests de consumidor. Esto generó algunos problemas en la generación y verificación de los contratos, los cuales requirieron ajustes en la configuración mas allá de lo esperado.

Orquestación de contenedores con docker compose

La orquestación de múltiples servicios utilizando Docker Compose fue otro apartado complejo, hubo muchos problemas por la ejecución en paralelo de los tres microservicios, principalmente conflictos de permisos y recursos compartidos, lo que dificultó el flujo esperado de generación de contratos y verificación con Pact.

Integrantes:
Agustin Troncoso
Carlos Iturra


