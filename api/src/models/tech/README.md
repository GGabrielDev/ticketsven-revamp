# Modelos estimados en esta carpeta

## Item

> La finalidad de este modelo es ser un objeto generico.
> Cualquier caracteristica que pueda ser compartida con otros objetos deberia de ser representada en su propio objeto individual
> Las relaciones que otras entidades tengan con este objeto son arbitrarias del objeto que la entidad represente. Pero por defecto todo otra entidad (a excepcion de `Deparment` y `Brand`) deberia de tener una relacion de _Uno a Muchos_ contra esta entidad,
> **Llaves de esta entidad:**

- `id`: Llave primaria.
  ⋅⋅⋅ Tipo: UUID (string). Declarado en la creación del objeto. Generado aleatoriamente.
- `name`: Nombre descriptivo del objeto.
  - Tipo: String.
- `model`: Modelo del objeto.
  - Tipo: String. Opcional.
- `serial`: Serial del objeto.
  - Tipo: String. Opcional.
- `amount`: Cantidad del objeto en cuestion.
  - Tipo: Number. Se asigna como `1` por defecto si no se especifica ningun valor.
- `details`: Detalles o observaciones del objeto.
  - Tipo: String.

## Brand

> Para representar marcas especificas de objetos, esto con la finalidad de filtrado mas efectivo.
> Deberiua de haber una relacion de _Uno a Muchos_ de esta entidad contra toda otra entidad en esta carpeta a excepción de `Deparment`.
> **Llaves de esta entidad:**

- `id`: Llave primaria.
  - Tipo: Number. Delcarado en la creación del objeto. Auto-incremento.
- `name`: Nombre del departamento.
  - Tipo: String.

## Department

> Este objeto es para representar una tabla asociativa para determinar que objeto pertenece a que departamento.
> Deberiua de haber una relacion de _Uno a Muchos_ de esta entidad contra toda otra entidad en esta carpeta a excepción de `Brand`.
> Puede ser abstraido en un futuro.
> **Llaves de esta entidad:**

- `id`: Llave primaria.
  - Tipo: Number. Delcarado en la creación del objeto. Auto-incremento.
- `name`: Nombre del departamento.
  - Tipo: String.

## RAM

> Representan sticks individuales de memoria RAM.
> Debe de tener una relacion _Muchos a Uno_ contra `Deparment` y `Brand`. A su vez puede tener una relacion _Muchos a Uno_ contra `Item` (para representar que las RAMs estan dentro de una computadora, por ejemplo)
> **Llaves de esta entidad:**

- `id`: Llave primaria.
  ⋅⋅⋅ Tipo: UUID (string). Declarado en la creación de la memoria RAM. Generado aleatoriamente.
- `type`: Tipo de memoria RAM (DDR)
  - Tipo: String. Forzar letras mayusculas (uppercasing)
- `size`: Capacidad de almacenamiento volatil de la memoria. Estimada en ser representada en Mega Bits (MB)
  - Tipo: Number.
- `speed`: Velocidad de la memoria RAM. Estimada en ser representada en Mega-Transferencias por Segundo (MT/s)
  - Tipo: Number.
- `model`: Modelo de la memoria RAM.
  - Tipo: String. Opcional.
- `serial`: Serial de la memoria RAM.
  - Tipo: String. Opcional.

## CPU

> Representan chips individuales de CPU.
> Debe de tener una relacion _Muchos a Uno_ contra `Deparment` y `Brand`. A su vez puede tener una relacion _Muchos a Uno_ contra `Item` (es muchos a uno para considerar servidores, que pueden tener mas de una CPU instalada)

- `id`: Llave primaria.
  ⋅⋅⋅ Tipo: UUID (string). Declarado en la creación del CPU. Generado aleatoriamente.
- `socket`: Socket el cual el chip puede ser utilizado.
  - Tipo: String.
- `speed`: Frequencia del reloj del CPU. Estimada en ser representada en Mega-Hertz por segundo (MHz)
  - Tipo: Number.
- `model`: Modelo del CPU.
  - Tipo: String.
- `serial`: Serial del CPU.
  - Tipo: String. Opcional.
- `details`: Detalles o observaciones del CPU
  - Tipo: String. Opcional.

## Storage

> Representacion de unidades de almacenamiento.
> Debe de tener una relacion _Muchos a Uno_ contra `Deparment` y `Brand`. A su vez puede tener una relacion _Muchos a Uno_ contra `Item` (para representar unidades de almacenamiento que puedan estar dentro de un computador)

- `id`: Llave primaria.
  ⋅⋅⋅ Tipo: UUID (string). Declarado en la creación de la unidad de almacenamiento. Generado aleatoriamente.
- `storage_type`: Tipo de unidad de almacenamiento.
  - Tipo: Enum. Datos posibles son "HDD", "SSD"
- `connection_type`: Tipo de coneccion/forma de acceso de la unidad.
  - Tipo: Enum. Datos posibles son: "IDE", "MiniIDE", "SATA", "M.2", "USB" y "TF" (Transfer Flash)
- `size`: Capacidad de almacenamiento del disco. Estimada en ser representada en Gigabits. (GB)
  - Tipo: Number.
- `model`: Modelo de la unidad.
  - Tipo: String. Opcional.
- `serial`: Serial de la unidad.
  - Tipo: String. Opcional.
- `details`: Detalles o observaciones de la unidad.
  - Tipo: String.

## Network

> Representación de tarjetas de red (integradas o dedicadas)
> Debe de tener una relacion _Muchos a Uno_ contra `Deparment` y `Brand`. A su vez puede tener una relacion _Muchos a Uno_ contra `Item` (para representar una o varias tarjetas de red que puedan estar dentro de un computador)

- `id`: Llave primaria.
  ⋅⋅⋅ Tipo: UUID (string). Declarado en la creación de la tarjeta de red. Generado aleatoriamente.
- `mac_list`: Lista de direcciones MAC disponibles en la tarjeta
  - Tipo: Arreglo de strings. Cada elemento individual del arreglo debe de pasar por un regex para confirmar que sea una direccion MAC valida. Sugerencia: `/^(?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2})$/`
- `model`: Modelo de la tarjeta.
  - Tipo: String. Opcional.
