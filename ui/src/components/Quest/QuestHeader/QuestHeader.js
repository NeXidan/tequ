import {BaseHeader} from '../../Base/BaseHeader/BaseHeader';

export class QuestHeader extends BaseHeader {
    get title() {
        return `Tequ / ${this.model.name}`;
    }
}
