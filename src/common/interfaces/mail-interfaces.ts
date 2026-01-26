export interface To {
  email: string
}

export interface Personalization {
  to: To[]
  subject: string
  dynamic_template_data: any
}

export interface From {
  email: string
  name: string
}

export interface Content {
  type: string
  value: string
}

export interface MailObject {
  personalizations: Personalization[]
  from: From
  content?: Content[]
  template_id: string
}
