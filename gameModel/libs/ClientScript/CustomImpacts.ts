Helpers.registerEffect(() => {
  ServerMethods.registerGlobalMethod(['PMGHelper'], 'sendMessage', {
    label: '[PMG] Send message',
    parameters: [
      {
        type: 'object',
        required: true,
        view: {
          label: 'From',
          type: 'i18nstring',
          layout: 'fullWidth',
        },
      },
      {
        type: 'object',
        required: true,
        view: {
          label: 'Subject',
          type: 'i18nstring',
          layout: 'fullWidth',
        },
      },
      {
        type: 'object',
        required: true,
        view: {
          label: 'Message',
          type: 'i18nhtml',
          layout: 'fullWidth',
        },
      },
      {
        type: 'array',
        required: true,
        value: [],
        view: {
          label: 'Attachments',
          layout: 'fullWidth',
        },
        items: {
          type: 'object',
          view: {
            label: 'File',
            type: 'attachment',
            pick: 'FILE',
          },
        },
      },
    ],
    returns: undefined,
  });
});
