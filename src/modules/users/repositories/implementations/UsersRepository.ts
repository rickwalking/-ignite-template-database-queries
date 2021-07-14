import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User | undefined> {
    const users = await this.repository.findOne({
      where: {
        id: user_id,
      },
      relations: ['games'],
    });

    return users;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("SELECT * from users ORDER BY first_name ASC");
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {;
    return this.repository.query(
      "SELECT * FROM users WHERE Lower(first_name) = Lower($1) AND Lower(last_name) = Lower($2)",
      [first_name, last_name]
    );
  }
}
