export class NftMetadataService {
  private readonly joiner: string = '::<SEP>::';

  public encodeFilesCid(ipfsUrl: string, realPrice: number): string {
    return `${ipfsUrl}${this.joiner}${realPrice}`
  }

  public decodeMetadata(metadata: string): {ipfsUrl: string, realPrice: number} {
    const [ipfsUrl, realPrice] = metadata.split(this.joiner)
    if (!ipfsUrl || !realPrice) throw new Error('Invalid files CID format')
    return { ipfsUrl, realPrice: parseFloat(realPrice) }
  }
}
