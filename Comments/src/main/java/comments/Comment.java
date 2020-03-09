/**
 * 
 */
package comments;

import java.sql.Date;

/**
 * Comment class
 * In posts, logged in users can add comments. Furthermore, all users can see the comments. 
 * Comments can include text, images.
 * 
 * @author Jake Liu
 * @date 2020-02-19
 */
public class Comment 
{
	//Primary key: comment id.
	private String commentID;
	
	//String id of the post this comment was made on
	private String postID;
	
	//String ID of the user that made the comment
	private String userID;
	
	//id of the parent to this comment
	//if the comment has no parent, parentID = ""
	private String parentID;
	
	//textual content of the comment
	private String content;
	
	//The date that the comment was made. Format: yyyy-mm-dd-hh:mm:ss
	private Date date;
	
	//getters and setters
	public String getCommentID() {
		return commentID;
	}

	public void setCommentID(String commentID) {
		this.commentID = commentID;
	}

	public String getPostID() {
		return postID;
	}

	public void setPostID(String postID) {
		this.postID = postID;
	}

	public String getUserID() {
		return userID;
	}

	public void setUserID(String userID) {
		this.userID = userID;
	}

	public String getParentID() {
		return parentID;
	}

	public void setParentID(String parentID) {
		this.parentID = parentID;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Date getDate() {
		return date;
	}
	
	public Date getDateTimestamp() throws IllegalArgumentException
	{
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}
	
	/**
	 * toString() of the comment
	 */
	public String toString()
	{
		String commentStr = "commentID: " + commentID;
		commentStr += ", postID: " + postID;
		commentStr += ", userID: " + userID;
		commentStr += ", parentID: " + parentID;
		commentStr += ", date: " + date.toString();		
		commentStr += ", content: " + content;
		
		return commentStr;
	}
	
	//constructor
	Comment(String commentID, String postID, String userID, String parentID, String content, Date date)
	{
		this.commentID = commentID;
		this.postID = postID;
		this.userID = userID;
		this.parentID = parentID;
		this.content = content;
		this.date = date;
	}
	
	//default constructor
	Comment()
	{
		commentID = "Missing commentID";
		postID = "Missing postID";
		userID = "Missing userID";
		parentID = "Missing parentID";
		content = "Missing content";
		date = new Date(0);
	}

}
