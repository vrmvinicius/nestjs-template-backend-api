import { Cliente } from '@/cliente/entities/cliente.entity';
import { EntityManager } from '@mikro-orm/core';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from 'src/common/results/result';
import { AtualizarClienteCommand } from './atualizar-cliente.command';
import { AtualizarClienteResponse } from './atualizar-cliente.response';

@CommandHandler(AtualizarClienteCommand)
export class AtualizarClienteHandler
   implements ICommandHandler<AtualizarClienteCommand, Result<AtualizarClienteResponse>>
{
   constructor(private readonly em: EntityManager) {}

   async execute(command: AtualizarClienteCommand): Promise<Result<AtualizarClienteResponse>> {
      if (!(await command.isValid())) {
         return Result.fail(command.errors);
      }

      const cliente = await this.em.findOne(Cliente, { id: command.id, ativo: true });

      if (!cliente) {
         return Result.notFound(`Cliente de ID ${command.id} não encontrado ou inativo.`);
      }

      const emailJaCadastrado = await this.em.count(Cliente, { email: command.email, id: { $ne: command.id } });

      if (emailJaCadastrado) {
         return Result.fail(`Email ${command.email} já cadastrado`);
      }

      cliente.atualizarNome(command.nome);
      cliente.atualizarEmail(command.email);
      cliente.atualizarTelefone(command.telefone);

      await this.em.transactional(async (em) => {
         await em.saveUpdate(cliente);
      });

      const response = new AtualizarClienteResponse({
         id: cliente.id,
         nome: cliente.nome,
         email: cliente.email.toString(),
         telefone: cliente.telefone.toString(),
      });

      return Result.created(response);
   }
}
