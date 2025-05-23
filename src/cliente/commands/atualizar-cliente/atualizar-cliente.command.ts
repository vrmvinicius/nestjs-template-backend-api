import { IsEmail, IsNotEmpty, IsNumber, IsString, Length, Matches, Min, ValidationArguments } from 'class-validator';
import { CommandBase } from 'src/common/domain/commands/command.base';

export class AtualizarClienteCommand extends CommandBase {
   @IsNumber({}, { message: 'ID deve ser um número' })
   @Min(1, { message: 'ID deve ser maior que zero' })
   public readonly id: number;

   @IsString({ message: 'Nome deve ser um texto' })
   @IsNotEmpty({ message: 'Nome não pode estar vazio' })
   @Length(3, 100, {
      message: (args: ValidationArguments) => {
         return `Nome deve ter entre ${args.constraints[0]} e ${args.constraints[1]} caracteres`;
      },
   })
   public readonly nome: string;

   @IsEmail({}, { message: 'Email inválido' })
   @IsNotEmpty({ message: 'Email não pode estar vazio' })
   public readonly email: string;

   @IsString({ message: 'Telefone deve ser um texto' })
   @IsNotEmpty({ message: 'Telefone não pode estar vazio' })
   @Matches(/^\d{10,11}$/, { message: 'Telefone deve conter 10 ou 11 dígitos' })
   public readonly telefone: string;

   constructor(params: { id: number; nome: string; email: string; telefone: string }) {
      super();
      this.id = params.id;
      this.nome = params.nome;
      this.email = params.email;
      this.telefone = params.telefone;
   }

   async isValid(): Promise<boolean> {
      return await this.validateThis();
   }
}
