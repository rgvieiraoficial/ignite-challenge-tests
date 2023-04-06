import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (host = 'database'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV === 'test' ? 'localhost' : host, //Essa opção deverá ser EXATAMENTE o nome dado ao service do banco de dados
      port: process.env.NODE_ENV === 'test' ? '5435' : '5432',
      database: process.env.NODE_ENV === 'test' ? 'fin_api_test' : defaultOptions.database
    })
  );
};
