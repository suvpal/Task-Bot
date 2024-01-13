const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('edittask')
		.setDescription('Edits tasks')
		.addStringOption(option => option.setName('task').setDescription('Input the task you want editited').setRequired(true))
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
				))
        .addStringOption(option => option.setName('description').setDescription('Input description').setRequired(false))
        .addStringOption(option =>
			option.setName('importance')
				.setDescription('Choose the importance')
				.setRequired(false)
				.addChoices(
					{ name: 'low', value: 'low' },
					{ name: 'mid', value: 'mid' },
					{ name: 'high', value: 'high' },
				))
        .addStringOption(option => option.setName('date').setDescription('Input date that the task should be completed').setRequired(false)),
	    async execute(interaction) {
            let task = interaction.options.getString('task')
            let team = interaction.options.getString('team')
            let description = interaction.options.getString('description')
            let importance = interaction.options.getString('importance')
            let date = interaction.options.getString('date')
            var axi = await axios.get('https://sheetdb.io/api/v1/usvp0pwz6undb?sheet='+team);
            const x = (axi.data)
            const y = Object.values(x)
            let a = 0;
            let b = 0;
            if(y.length === 0){
                b = 'There are no tasks associated with this team'
            }
            else {
                console.log('hi')
                for(var i = 0; i < y.length; i++) {
                    const z = y[i]
                    if(description === null) {
                        description = z['description']
                    }
                    if(importance === null) {
                        importance = z['importance']
                    }
                    if(date === null) {
                        date = z['date']
                    }
                    if(z['task'] === task) {
                        b = 'The task was edited'
                        
                        fetch('https://sheetdb.io/api/v1/usvp0pwz6undb/task/' + z['task'] + '?sheet=' + team, {
                            method: 'PATCH',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                data: {
                                        'description': description,
                                        'importance': importance,
                                        'date': date
                                        
                                }
                            })
                        })
                        const editTaskEmbed = new EmbedBuilder()
                            .setColor(0x1C6825)
                            .setTitle('Edited Task')
                            .setDescription('A task assigned to you has been edited')
                            .addFields(
                                { name: 'Task', value: task },
                                { name: 'Description', value: description },
                                { name: 'Importance', value: importance },
                                { name: 'Team', value: team },
                                { name: 'Date that the task should be completed', value: date },
                            )
                            .setTimestamp()
                        interaction.client.users
                            .fetch(`${z['id']}`)
                            .then((user) => {
                                user.send({embeds: [editTaskEmbed]})					
                            });
                        
                    }
                    else if(i === y.length-1) {
                        b = 'This task does not exist'
                    }
                }
            }
            await interaction.reply({ content: b, ephemeral:true });
        }
};