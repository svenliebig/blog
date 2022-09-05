import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
@Entity()
export class Post {
	@PrimaryGeneratedColumn()
	public id!: string

	@Column('text')
	public title: string

	@Column('text')
	public content: string

	constructor(title: string, content: string) {
		this.title = title
		this.content = content
	}
}
