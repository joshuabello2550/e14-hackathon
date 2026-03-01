export interface SessionEvent {
  uuid: string;
  event: string;
  timestamp: string;
  elements: ElementType[];
  elements_html: string;
  selected_html: string;
  window_id: string | null;
  current_url: string | null;
  event_type: string | null;
  viewport_width: number | null;
  viewport_height: number | null;
  screen_name: string | null;
  distinct_id: string;
}

export interface ElementType {
  attr_class?: string[];
  attr_id?: string;
  attributes: Record<string, string>;
  href?: string;
  nth_child?: number;
  nth_of_type?: number;
  order?: number;
  tag_name: string;
  text?: string;
}
