const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

var name;

module.exports = {
	data: new SlashCommandBuilder()	
		.setName('printtasks')
		.setDescription('Replies with submitted tasks')
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
		const team = interaction.options.getString('team')
		var axi = await axios.get('https://sheetdb.io/api/v1/usvp0pwz6undb?sheet='+team);
		const x = (axi.data)
		const y = Object.values(x)
		var b;
		if(y.length > 0) {
			for(var i = 0; i < y.length; i++) {
				const z = y[i]
				const a = (i+1).toString() + '. ' + 'name: ' + z['name'] + '\n   task: ' + z['task'] + '\n   description: ' + z['description'] + '\n   importance: ' + z['importance'] + '\n   completed: '+  z['completed']
				b += '\n' 
				b += a
				b = b.replace('undefined', '')
			}
		}
		else {
			b = 'There are no task for this team'
		}
		await interaction.reply({content: b, ephemeral: true});
	}
};