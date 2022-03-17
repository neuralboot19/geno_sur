# README

2 Operando sobre el ORM de Rails

Considera un modelo de datos en el que tienes los siguientes modelos:
• Company: Representa una empresa hotelera. Tiene, entre otros, los campos name, logo, y
admin email (correo del encargado).
• Hotel: Representa un hotel. Tiene, entre otros, referencias a company id, a address id y los
campos name, logo, admin email.
• Address: Contiene campos asociados a una direcci ́on.
• Room: Representa la habitaci ́on de un hotel. Tiene, entre otros, una referencia a hotel id y los
campos price per night, currency, floor, number.
• Guest: Representa un visitante. Entre otros, incluye los campos identity type, identity number,
first name, middle name, last names, date of birth, email, phone number
• Payment: Contiene campos que representan un pago.
• Reservation: Representa una reserva en el hotel. Vincula visitantes con habitaciones y sus
pagos con las referencias guest id, room id y payment id. Adem ́as contiene, entre otros, los
campos date from, date to.
Un desarrollador del equipo quiere hacer una funci ́on que, dada una empresa, permita obtener la
cantidad de reservas por fecha. La soluci ́on propuesta es la siguiente:

```ruby
class Company < ApplicationRecord
has_many :hotels, dependent: :destroy

  def reservationsbydate
    reservationsbydate = {}
    hotels.map(&:reservations).flatten.map{| r | 
      (r.date_from..r.date_to).each{ | d a te |
        if reservations_by_date.include?(date)
          reservationsbydate[date] += 1
        else
          reservationsbydate[date] = 1
        end
      }
    }
    reservationsbydate
  end
end
```

1- ¿Por qué el código anterior es ineficiente en su forma de consultar a la base de datos?
Porque cada vez que itera(`.map(&:reservations)`) realiza consultas innecesarias a la base de datos, esto se le conoce como un problema de N+1, se arreglaria solo agregando un `has_many :reservations, through: :hotels` al modelo, para que haga una sola consulta para obtener las reservaciones de una compañía en particular, internamente se generaria una consulta SQL como esta:

"SELECT 'reservations'.* FROM 'reservations' INNER JOIN 'hotels' ON 'reservations'.'hotel_id' = 'hotels'.'id' WHERE 'hotels'.'company_id' = <ID de la compañía>"

De esta manera hace una sola consulta para traerse las reservaciones

2- Proponga una implementación alternativa a la función reservations_by_date que haga una cantidad constante de consultas a la base de datos (mientras menos, mejor).

```ruby
class Company < ApplicationRecord
  has_many :hotels, dependent: :destroy
  has_many :reservations, through: :hotels

  def reservations_by_date
    reservations_by_date = {}

    reservations.map do |r|
      (r.date_from..r.date_to).each do |date|
        reservations_by_date[date] = reservations_by_date[date].presence.to_i + 1
      end
    end

    reservations_by_date
  end
end
```

3- Bonus 1: Proponga una implementación razonable del modelo Address.

```ruby
class Hotel < ApplicationRecord
  belongs_to :address
end

class Address < ApplicationRecord
  has_one :hotel

  # TODO some validations for address fields
end
```

4- Bonus 2: Proponga validaciones razonables para el modelo de Reservation. Puede ser en
pseudocódigo.

```ruby
class Reservation < ApplicationRecord
  belongs_to :guest
  belongs_to :room
  belongs_to :payment
  belongs_to :hotel

  validates_presence_of :guest_id, :room_id, :hotel_id, :date_from, :date_to

  # El pago puede ser opcional ya que una persona puede reservar sin haber pagado
  # y hacerlo hasta que llegue al hotel
  validates :payment_id, optional: true
end
```

3 Uso de API
  Direccion del repositorio: https://github.com/neuralboot19/geno_sur
  Url en HEROKU: https://geno-sur-desafio.herokuapp.com

  Instruccion para docker:
    1- Ejecurar ```docker-compose run web rails db:create``` desde la termina una vez que tengas el proyecto en tu local
    2- Ejecutar ```docker-compose up``` en caso de que ya tengas el contenedor creado desde el comando anterior
    3- Abrir el navegador en localhost