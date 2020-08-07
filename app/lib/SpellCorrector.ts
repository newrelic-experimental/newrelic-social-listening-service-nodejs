import { injectable } from 'inversify';
import SpellCorrector from 'spelling-corrector';

@injectable()
export class SpellCorrectorFactory {
  public corrector: any;

  constructor() {
    this.corrector = new SpellCorrector();
    this.corrector.loadDictionary();
  }

  public correct = (text: string): string => this.corrector.correct(text);
}
