const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('completetask')
		.setDescription('Completes tasks')
		.addStringOption(option => option.setName('complete').setDescription('Input the task which was completed').setRequired(true))
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
		const complete = interaction.options.getString('complete')
		const team = interaction.options.getString('team')
        var axi = await axios.get('https://sheetdb.io/api/v1/usvp0pwz6undb?sheet=' + team);
		const x = (axi.data)
		const y = Object.values(x)
		if(y.length === 0){
			b = 'There are no tasks associated with this team'
		}
		for(var i = 0; i < y.length; i++) {
			const z = y[i]
            if(z['task'] === complete && z['completed'] != 'TRUE') {
				console.log(z['task'])
				b = 'Task was set to complete'
				fetch('https://sheetdb.io/api/v1/usvp0pwz6undb/task/' + z['task'] + '?sheet=' + team, {
    				method: 'PATCH',
    				headers: {
        				'Accept': 'application/json',
        				'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						data: {
								'completed': "TRUE"
						}
					})
				})
            }
			else if(z['task'] === complete && z['completed'] === 'TRUE') {
				b = 'This task is already completed'
			}
			else if(i === y.length-1) {
				b = 'This task does not exist'
			}
        }
		await interaction.reply({ content: b, ephemeral:true });
    }
};