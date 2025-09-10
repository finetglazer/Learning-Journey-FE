interface SourceObject {
  name: string;
  src: string;
}

export class ExternalAssetService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public assets: Record<string, Promise<any>> = {};

  public prepareAssets(scripts: SourceObject[]): void {
    scripts.forEach(({ name, src }) => {
      this.assets[name] = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          resolve(window[name as any]);
        };
        script.onerror = () =>
          reject(`The script ${name} didn't load correctly.`);
        document.body.appendChild(script);
      });
    });
  }

  public getAsset(scriptName: string) {
    return this.assets[scriptName];
  }
}

export const externalAssetService = new ExternalAssetService();
