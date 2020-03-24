package comments;

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
	
	//Write comments into the DB
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
		return logStr;
	}
	
	/**
	 * Read comments into the DB
	 * 1-Hot Comment fields will be the search criteria.
	 * TODO: implement functionality for more than just postID
	 */
	public String readRequest(Comment request, Context context)
	{
		//parse parameters
		//TODO implement functionality for more than just postID
		if(request.getParentID().equals("null"))
			return "Error: invalid parameters.";
		
		//connect to the database
		CommentDBManager dbManager = new CommentDBManager();
		dbManager.readDBCredentials("src/main/java/comments/config.ini");
		dbManager.initDBConnection();
		
		//read comment
		String jsonResponse = dbManager.queryCommentsByParentID(request.getParentID());
		
		//close
		dbManager.closeDBConnection();		
		
		//report success
		return jsonResponse;
	}
	
	/**
	 * Delete comments from the DB
	 * 1-Hot Comment fields will be the search criteria.
	 * TODO: implement functionality for more than just parentID
	 */
	public String deleteRequest(Comment request, Context context)
	{
		//parse parameters
		//TODO implement functionality for more than just postID
		if(request.getParentID().equals("null"))
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
