const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addtask')
		.setDescription('Submits tasks')
		.addStringOption(option => option.setName('name').setDescription('Person want to assign the task').setRequired(true))
		.addStringOption(option => option.setName('id').setDescription('Copy the id of the person you want to assign to the task').setRequired(true))
		.addStringOption(option => option.setName('task').setDescription('Input task').setRequired(true))
		.addStringOption(option => option.setName('description').setDescription('Input description').setRequired(true))
		.addStringOption(option =>
			option.setName('importance')
				.setDescription('Choose the importance')
				.setRequired(true)
				.addChoices(
					{ name: 'low', value: 'low' },
					{ name: 'mid', value: 'mid' },
					{ name: 'high', value: 'high' },
				))	
		.addStringOption(option =>
			option.setName('team')
				.setDescription('Choose team')
				.setRequired(true)
				.addChoices(
					{ name: 'PW', value: 'PW' },
					{ name: 'Design', value: 'Design' },
					{ name: 'Tech', value: 'Tech' },
					{ name: 'TD', value: 'TD' },
					{ name: 'CE', value: 'CE' },
					{ name: 'CD', value: 'CD' },
					{ name: 'VP', value: 'VP' },
				))	
		.addStringOption(option => option.setName('date').setDescription('Input date that the task should be completed').setRequired(true)),

	async execute(interaction) {
		const name = interaction.options.getString('name')
		const id = interaction.options.getString('id')
		const task = interaction.options.getString('task')
		const description = interaction.options.getString('description')
		const importance = interaction.options.getString('importance')
		const team = interaction.options.getString('team')
		const date = interaction.options.getString('date')
		var axi = await axios.get('https://sheetdb.io/api/v1/usvp0pwz6undb?sheet=' + team);
		const x = (axi.data)
		const y = Object.values(x)
		let b = 0
		let c = false
		const taskEmbed = new EmbedBuilder()
			.setColor(0x1C6825)
			.setTitle('Assigned Task')
			.setDescription('A task has been assigned to you')
			.addFields(
				{ name: 'Task', value: task },
				{ name: 'Description', value: description },
				{ name: 'Importance', value: importance },
				{ name: 'Team', value: team },
				{ name: 'Date that the task should be completed', value: date },
				{ name: 'Sender of task', value: interaction.member.user.tag },
			)
			.setTimestamp()
		for(var i = 0; i < y.length; i++) {
			const z = y[i]
            if(z['task'] === task) {
				c = true
            }
        }
		if(c === false) {
			b = 'Task Submitted'
			axios.post('https://sheetdb.io/api/v1/usvp0pwz6undb?sheet=' + team, {
				data: {
					id: `${id}`,
					task: `${task}`,
					description: `${description}`,
					importance: `${importance}`,
					date: `${date}`,
					completed: 'FALSE',
					name: `${name}`,
					sender: `${interaction.member.user.tag}`
				}
			})
			
			interaction.client.users
				.fetch(`${id}`)
				.then((user) => {
					user.send({embeds: [taskEmbed]})
				});
		}
		else {
			b = 'This task already exists'
		}

		await interaction.reply({ content: b, ephemeral: true });
		
	}
};