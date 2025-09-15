import * as OBC from '@thatopen/components';

export class TodoCreator extends OBC.Component {
  static uuid = '0fab73ec-6991-4995-aa0f-a34f474f061d'
  enabled = true;

  constructor(components: OBC.Components) {
    super(components)
    this.components.add(TodoCreator.uuid, this)
  }

  addTodo() {
    console.log('addTodo')
  }
}