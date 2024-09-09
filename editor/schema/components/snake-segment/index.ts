import type { WidgetSchema } from 'remiz-editor';

export const snakeSegment: WidgetSchema = {
  title: 'components.snakeSegment.title',
  fields: [
    {
      name: 'index',
      title: 'components.snakeSegment.index.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    index: 0,
  }),
};
