class ConfigStore {
  private static instance: ConfigStore;
  private config: Record<string, string> = {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance() {
    if (!ConfigStore.instance) {
      ConfigStore.instance = new ConfigStore();
    }
    return ConfigStore.instance;
  }

  set(key: string, value: string) {
    this.config[key] = value;
  }

  get(key: string) {
    return this.config[key];
  }
}

export default ConfigStore;
