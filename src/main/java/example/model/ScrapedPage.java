package example.model;

public class ScrapedPage {
    private boolean worked;
    private boolean has_more;
    private String next_url;
    private String html;

    public ScrapedPage() {
    }

    public boolean isWorked() {
        return worked;
    }

    public void setWorked(boolean worked) {
        this.worked = worked;
    }

    public boolean isHas_more() {
        return has_more;
    }

    public void setHas_more(boolean has_more) {
        this.has_more = has_more;
    }

    public String getNext_url() {
        return next_url;
    }

    public void setNext_url(String next_url) {
        this.next_url = next_url;
    }

    public String getHtml() {
        return html;
    }

    public void setHtml(String html) {
        this.html = html;
    }
}
