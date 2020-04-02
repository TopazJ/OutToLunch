package comments;

import java.util.ArrayList;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

/**
 * Lambda used to make comment insertion queries of the comment database
 * Based on https://www.youtube.com/watch?v=64dnqaixT3w&list=WL&index=3&t=4s
 * 
 * @author Jake Liu
 * @since 2020-02-25
 */
public class CommentLambda implements RequestHandler<Comment, String>
{
	//Echo given comment
	@Override
	public String handleRequest(Comment request, Context context) 
	{			
		return "Lambda received the following comment: " + request.toString();
	}
	
	/**
	 * Write comments into the DB
	 * 
	 * @return Confirmation of wiping. ["Success: "]
	 */
	public String insertRequest(Comment request, Context context) 
	{	
		String logStr = "CommentLambda.insertRequest received.";
		logStr += "Comment: " + request.toString() + ". ";
		
		//connect to the database
		CommentDBManager dbManager = new CommentDBManager();
		dbManager.readDBCredentials("src/main/java/comments/config.ini");
		dbManager.initDBConnection();
		logStr += "Connected to DB successfully.";		
		
		//insert comment
		dbManager.insertCommentRow(request);
		logStr += "Comment inserted to DB successfully.";		
		
		//close
		dbManager.closeDBConnection();		
		
		//report success
		return "Success: " + logStr;
	}
	
	/**
	 * Read comments from the DB based on parameters
	 * specified by the given comment.
	 * 
	 * Read all children of a parent:
	 * 	request{ parentID: <parentID>, all else: "null" } 
	 * 
	 * Get count of all children of a parent:
	 *  request{ parentID: <parentID>, content: [count], all else: "null" }
	 * 
	 * Read the n oldest/youngest 1st gen children of a parent: 
	 * 	request{ parentID: <parentID>, content: [n:<n>,offset:<offset>], all else: "null" }
	 *
	 * Read all comments made by a user:
	 *  request{ userID: <userID>, all else: "null"}
	 *  
	 * Read 1 comment by commentID
	 *  request{ commentID: <commentID>, all else: "null" } 
	 *  
	 * @param request Comment with parameters for query
	 * @param context AWS Lambda context
	 * @return JSON list of read comments.
	 */
	public String readRequest(Comment request, Context context)
	{
		//connect to the database
		CommentDBManager dbManager = new CommentDBManager();
		dbManager.readDBCredentials("src/main/java/comments/config.ini");
		dbManager.initDBConnection();
				
		//parse parameters
		int n=0, offset=0;
		char mode = 's';
		if(request.getParentID().equals("null"))
			return "Error: invalid parameters.";
		if(!request.getCommentID().equals("null") && !request.getCommentID().equals("Missing userID") && !request.getCommentID().equals(""))
			mode='i';
		if(!request.getContent().equals("null"))
		{
			//check for 'a'
			ArrayList<String> flankers = new ArrayList<String>();
			flankers.add("[n:");		flankers.add(",");
			flankers.add("offset:");	flankers.add("]");
			ArrayList<String> values = dbManager.parseValues(request.getContent(), flankers);
			if(values.size() > 0)
			{
				n = Integer.parseInt(values.get(0));
				offset = Integer.parseInt(values.get(1));			
				mode = 'a';
			}
			flankers.clear();
			
			//check for 'c'
			if(mode!='a' && request.getContent().equals("[count]"))
				mode = 'c';			
		}
		if(!request.getUserID().equals("null") && !request.getUserID().equals("Missing userID") && !request.getUserID().equals(""))
			mode='u';
		
		//read comment	
		String jsonResponse;
		switch(mode)
		{
			case 's':
				jsonResponse = dbManager.queryCommentsByParentID(request.getParentID(), 's');
				break;
			case 'c':
				jsonResponse = dbManager.queryCommentsByParentID(request.getParentID(), 'c');
				break;
			case 'a':
				jsonResponse = dbManager.queryCommentsByAge(request.getParentID(), n, offset);
				break;
			case 'u':
				jsonResponse = dbManager.queryCommentsByColumnID("userID", request.getUserID());
				break;
			case 'i':
				jsonResponse = dbManager.queryCommentsByColumnID("commentID", request.getCommentID());
				break;
			default:
				jsonResponse = "Error: No comments read.";
				break;
		}
			
		//close
		dbManager.closeDBConnection();		
		
		//report success
		return jsonResponse;
		
	}
	
	/**
	 * Wipe a comment from the DB.
	 * Wiping means replacing the userID and/or comment content
	 * with a [deleted] message.
	 * request
	 * {
	 *  commentID = <commentID>
	 * 	userID = ["wipe"|"null"]
	 * 	content = ["wipe"|"null"]
	 * }
	 * all other fields = "null" or 0
	 * 
	 * @param request Comment request.
	 * @param context Lambda context.
	 * @return Confirmation of wiping. ["Success: "|"Error: "]
	 */
	public String wipeRequest(Comment request, Context context)
	{
		if(request.getCommentID().equals("null"))
			return "Error: invalid parameters.";
			
		//connect to the database
		CommentDBManager dbManager = new CommentDBManager();
		dbManager.readDBCredentials("src/main/java/comments/config.ini");
		dbManager.initDBConnection();
		
		//wipe comment
		char mode = 'e';
		boolean userWipe = request.getUserID().equals("00000000000000000000000000000000");
		boolean contentWipe = request.getContent().equals("wipe");
		if(userWipe && contentWipe)mode = 'b';
		else if(userWipe)mode = 'u';
		else if(contentWipe)mode = 'c';
		dbManager.wipeCommentByCommentID(request.getCommentID(), mode);
		
		//close
		dbManager.closeDBConnection();	
		
		//report success
		return "Success: Comment with commentID="+request.getCommentID()+" wiped.";
	}
	
	/**
	 * Update a comment based on the commentID
	 * request
	 * {
	 *  "commentID": <commentID>,
	 *  "userID": <userID>,
	 *  "content": <content>,
	 *  "numChildren": <numChildren>,
	 * 	all else: <updated info>
	 * }
	 * 
	 * @param request Comment request.
	 * @param context Lambda context.
	 * @return Confirmation of wiping. ["Success: "|"Error: "]
	 */
	public String updateRequest(Comment request, Context context)
	{
		//parse parameters
		if(request.getCommentID().equals("null"))
			return "Error: invalid parameters.";
		
		//connect to the database
		CommentDBManager dbManager = new CommentDBManager();
		dbManager.readDBCredentials("src/main/java/comments/config.ini");
		dbManager.initDBConnection();
		
		//update comment
		dbManager.updateCommentByCommentID(request.getCommentID(), request.getUserID(), request.getContent(), request.getNumChildren());
		
		//close
		dbManager.closeDBConnection();	
		
		//report success
		return "Success: Comment with commentID=" + request.getCommentID() + " updated.";
	}
	
	/**
	 * Delete comments from the DB using comment fields
	 * Delete all children of parent ID: request{"parentID": <parentID>, "all else":null}
	 *
	 * @param request Comment detailing parameters to delete comments by.
	 * @param context AWS Lambda context;
	 * @return Confirmation of deletion. ["Success: "|"Error: "]
	 */
	public String deleteRequest(Comment request, Context context)
	{
		//parse parameters
		if(request.getParentID().equals("null") && request.getCommentID().equals("null"))
			return "Error: invalid parameters.";
		
		//connect to the database
		CommentDBManager dbManager = new CommentDBManager();
		dbManager.readDBCredentials("src/main/java/comments/config.ini");
		dbManager.initDBConnection();
		
		//read comment
		String jsonResponse = dbManager.deleteCommentsByParentID(request.getParentID());
		
		//close
		dbManager.closeDBConnection();		
		
		//report success
		return jsonResponse;
	}
}
