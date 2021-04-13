import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Terminal } from '../../common/terminal.entity';

export default class CreateTerminal implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Terminal)
      .values([
        {
          name: 'Mỹ Đình', //* DONE
          address: 'Từ Liêm, Hà Nội',
          latitude: '21.0284120968974',
          longitude: '105.77828474956691',
          locationId: 1,
        },
        {
          name: 'Giáp Bát', //* DONE
          address: 'Hoàng Mai, Hà Nội',
          latitude: '20.980263238099404',
          longitude: '105.8414503459475',
          locationId: 1,
        },
        {
          name: 'Nước Ngầm', //* DONE
          address: 'Hoàng Mai, Hà Nội',
          latitude: '20.96498492057142',
          longitude: '105.84215629646273',
          locationId: 1,
        },
        {
          name: 'Gia Lâm', //* DONE
          address: 'Long Biên, Hà Nội',
          latitude: '21.048545080619885',
          longitude: '105.87831089646433',
          locationId: 1,
        },
        {
          name: 'Bãi Cháy', //* DONE
          address: 'Hạ Long, Quảng Ninh',
          latitude: '20.972632357110307',
          longitude: '107.01436965413401',
          locationId: 2,
        },
        {
          name: 'Móng Cái', //* DONE
          address: 'Móng Cái, Quảng Ninh',
          latitude: '21.531268567427237',
          longitude: '107.95835730996707',
          locationId: 2,
        },
        {
          name: 'Đà Nẵng', //* DONE
          address: 'Liên Chiểu, Đà Nẵng',
          latitude: '16.05670135356242',
          longitude: '108.17253466754558',
          locationId: 3,
        },
        {
          name: 'Đức Long', //* DONE
          address: 'Hòa Vang, Đà Nẵng',
          latitude: '15.968092197103285',
          longitude: '108.21161859637996',
          locationId: 3,
        },
        {
          name: 'Miền Đông',
          address: 'Bình Thạnh, Thành phố Hồ Chí Minh',
          latitude: '10.8149291750675',
          longitude: '106.71082772515835',
          locationId: 4,
        },
        {
          name: 'Miền Tây',
          address: 'Bình Tân, Thành phố Hồ Chí Minh',
          latitude: '10.741175041805182',
          longitude: '106.61894276748652',
          locationId: 4,
        },
      ])
      .execute();
  }
}
