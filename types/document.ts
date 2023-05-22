export interface Document {
    id: number /* primary key */;
    owner?: string /* foreign key to auth.users.id */;
    object_id?: string /* foreign key to storage.objects.id */;
    name: string;
    metadata: DocMetadata;
    status: DocumentStatus | null;
    date_uploaded: string;
    parse_attempts: number;
    status_message: StatusMessage | null;
}

export interface DocMetadata {
    cacheControl: string;
    contentLength: number;
    eTag: string;
    httpStatusCode: number;
    lastModified: string;
    mimetype: string;
    size: number;
}

export enum DocumentStatus {
    Parsed = 'Parsed',
    Parsing = 'Parsing',
    Error = 'Error'
}

export enum StatusMessage {
    'The document is currently being parsed',
    'The document was fully parsed',
    'An error occurred while parsing the document',
    'The document has an invalid file type'
}
