import { IMetadata } from "../interfaces/nft";

export class FilesCidService {
  private readonly joiner: string = '|'
  public encodeFilesCid(data: IMetadata): string {
    return `${data.fileCID}${this.joiner}${data.coverImageCID}`
  }
  public decodeMetadata(metadata: string): IMetadata {
    const [fileCID, coverImageCID] = metadata.split(this.joiner)
    if (!fileCID || !coverImageCID) throw new Error('Invalid files CID format')
    return { fileCID, coverImageCID }
  }
}
