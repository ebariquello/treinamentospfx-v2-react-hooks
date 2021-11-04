enum EnvType {
  'Online',
  'On-Premise'
}

export default class SharePoint {

  private _env: EnvType;

  private _version: string;

  constructor() {
      this._env = EnvType.Online;
  }

  public get env(): EnvType {
      return this._env;
  }

  public set env(value: EnvType) {
      if (undefined == EnvType[value]) {
          throw TypeError('EnvType is out of range.');
      }
      this._env = value;
  }

  public get version(): string {
      return this._version;
  }

  public set version(value: string) {
      this._version = value;
  }
}