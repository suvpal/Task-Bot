const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { kgsearch } = require('googleapis/build/src/apis/kgsearch');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('removetask')
		.setDescription('Removes tasks')
		.addStringOption(option => option.setName('task').setDescription('Input task').setRequired(true))
		.addStringOption(option =>
			option.setName('team')
				.setDescription('Input which team\'s tasks you want to access')
				.setRequired(true)
				.addChoices(
					{ name: 'PW', value: 'PW' },
					{ name: 'Design', value: 'Design' },
					{ name: 'Tech', value: 'Tech' },
					{ name: 'TD', value: 'TD' },
					{ name: 'CE', value: 'CE' },
					{ name: 'CD', value: 'CD' },
					{ name: 'VP', value: 'VP' },
				)),
	async execute(interaction) {
		const task = interaction.options.getString('task')
		const team = interaction.options.getString('team')
        var axi = await axios.get('https://sheetdb.io/api/v1/usvp0pwz6undb?sheet=' + team);
		const x = (axi.data)
		const y = Object.values(x)
		let b = 0
		let d = 0
		
		if(y.length === 0){
			b = 'There are no tasks associated with this team'
		}
		else {
			for(var i = 0; i < y.length; i++) {
				const z = y[i]
				if(z['task'] === task) {
					
					b = 'Task Removed'
					fetch('https://sheetdb.io/api/v1/usvp0pwz6undb/task/' + z['task'] + '?sheet=' + team, {
						method: 'DELETE',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					})
					.then((response) => response.json())
					.then((data) => console.log(data));
					const removeEmbed = new EmbedBuilder()
						.setColor(0x1C6825)
						.setTitle('Removed Task')
						.setDescription('A task that was assigned to you has been removed')
						.addFields(
							{ name: 'Task', value: task },
							{ name: 'Description', value: z['description'] },
							{ name: 'Team', value: team },
						)
						.setTimestamp()
					interaction.client.users
						.fetch(`${z['id']}`)
						.then((user) => {
							user.send({embeds: [removeEmbed]})					
						});
				}
				else if(i === y.length-1) {
					b = 'This task does not exist'
				}
			}
		}
		
		await interaction.reply({ content: b, ephemeral: true });
	} 
};