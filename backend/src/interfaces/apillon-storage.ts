export interface IApillonUploadSession {
  id: string
  status: number
  data: {
    sessionUuid: string
    files: [
      {
        path: string | null
        fileName: string
        contentType: string
        url: string
        fileUuid: string
      },
    ]
  }
}

export interface ISessionEnd {
  id: string
  status: number
  data: boolean
}

export interface IApillonFileDetails {
  id: string
  status: number
  data: {
    createTime: string
    updateTime: string
    fileUuid: string
    CID: string
    name: string
    contentType: string
    path: string
    size: number
    fileStatus: number
    link: string
    directoryUuid: string
  }
}

export interface IIpfsFile {
  id: number
  createTime: string
  updateTime: string
  fileUuid: string
  CID: string
  CIDv1: string
  name: string
  contentType: string
  path: string
  size: number
  fileStatus: number
  link: string
}
export interface IFetchedFolders {
  data: {
    total: number
    page: number
    limit: number
    items: Array<{
      uuid: string
      type: number
      name: string
      CID: string | null
      createTime: string
      updateTime: string
    }>
  }
}
