package comments;

import java.io.*;
import java.sql.Timestamp;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Scanner;

/**
 * Manages writing and reading comments from the DB.
 * 
 * @author Animal Farm
 * @date 2020-03-01
 */
public class CommentDBManager 
{
	//set to true and then fill in the actual db credentials for
	//maven compiling a jar for an AWS lambda.
	private static final boolean lambdaCompile = true;
	
	//Insert Comment statement
	private static final String INSERT_STATEMENT = "INSERT INTO comments.comment (commentID, userID, parentID, content, date, numChildren) VALUES (?,?,?,?,?,?)";
	
	//Query Comment statement
	private static final String SELECT_STATEMENT_P1 = "SELECT * FROM comments.comment WHERE ";
	private static final String SELECT_STATEMENT_P2 = " = (?)";
	
	//Update Comment statement
	private static final String UPDATE_STATEMENT = "UPDATE comments.comment SET userID = (?), content = (?), numChildren = (?) WHERE commentID = (?)";
	
	//Delete Comment statement
	private static final String DELETE_STATEMENT = "DELETE FROM comments.comment WHERE commentID = (?)";
	
	//Connection to the DB
	Connection dbConn;
	
	//DB url
	String url;
	
	//DB user
	String user;
	
	//DB password
	String password;
	
	/**
	 * Read a given config file to get the DB credentials.
	 * Make sure the config file has no spaces.
	 * 
	 * @param filename filename of config file.
	 */
	void readDBCredentials(String filename)
	{
		//Read credentials from an ini file (doesn't work with lambda)
		if(!lambdaCompile)
		{
			File configFile = new File(filename);
			try
			{
				Scanner fileScanner = new Scanner(configFile);
				
				//parse url
				String line = fileScanner.nextLine();
				url=line.substring(line.indexOf('=')+1);
				
				//parse user
				line = fileScanner.nextLine();
				user=line.substring(line.indexOf('=')+1);
				
				//parse password
				line = fileScanner.nextLine();
				password=line.substring(line.indexOf('=')+1);
				
				fileScanner.close();	
			}
			catch(IOException e)
			{
				e.printStackTrace();
				System.exit(-1);
			}
		}
		else
		{
			//hard code the DB credentials when compiling with maven for lambda
			url="";
			user="";
			password="";
		}
	}
	
	/**
	 * Init the DB connection
	 */
	void initDBConnection()
	{
		try 
		{
			Class.forName("com.mysql.cj.jdbc.Driver");
			dbConn = DriverManager.getConnection(url, user, password);
			System.out.println("Connected to DB successfully.");
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
			System.exit(-1);
		} 
		catch (ClassNotFoundException e) 
		{
			e.printStackTrace();
			System.exit(-1);
		}
	}
	
	/**
	 * Parse the values from a string based on preceding and succeeding strings.
	 * If there is an error with parsing parameters, return an empty arraylist.
	 * 
	 * @param ogString The original, whole string.
	 * @param flankers ArrayList of Strings flanking the parameters needed. Must be even in size.
	 * @return values ArrayList of resulting parsed values.
	 */
	ArrayList<String> parseValues(String ogString, ArrayList<String> flankers)
	{
		if(flankers.size() % 2 != 0)
		{
			System.out.println("Uneven flankers size.");
			System.exit(-1);
		}
		
		ArrayList<String> values = new ArrayList<String>();
		
		int i=0;
		int j=0;
		for(int iter=0; iter<flankers.size()-1; iter+=2)
		{
			i=ogString.indexOf(flankers.get(iter), j);
			if(i<0) return new ArrayList<String>();
			i+=flankers.get(iter).length();
			j=ogString.indexOf(flankers.get(iter+1), i);
			if(j<0) return new ArrayList<String>();
			values.add(ogString.substring(i, j));
		}
		return values;
	}
	
	/**
	 * Insert a comment into the comment DB
	 * Update parent child status.
	 *
	 * @param com Comment object to insert.
	 */
	void insertCommentRow(Comment com)
	{
		try 
		{
			//prepare the statement		
			PreparedStatement dbInsertPS = dbConn.prepareStatement(INSERT_STATEMENT);
			dbInsertPS.setString(1, com.getCommentID());		
			dbInsertPS.setString(2, com.getUserID());
			dbInsertPS.setString(3, com.getParentID());
			dbInsertPS.setString(4, com.getContent());
			dbInsertPS.setTimestamp(5, com.getDate());		
			dbInsertPS.setInt(6, com.getNumChildren());
			
			//execute
			dbInsertPS.executeUpdate();
			
			//update parents
			String parentJSON = queryCommentsByColumnID("commentID", com.getParentID());
			if(!parentJSON.equals(""))
			{
				ArrayList<String> flankers = new ArrayList<String>();
				flankers.add("\"userID\": \"");		flankers.add("\",");
				flankers.add("\"content\": \"");	flankers.add("\",");
				flankers.add("\"numChildren\": ");	flankers.add(" }");
				ArrayList<String> values = parseValues(parentJSON, flankers);
				String userID = values.get(0);
				String content = values.get(1);
				int numChildren = Integer.parseInt(values.get(2));
				updateCommentByCommentID(com.getParentID(), userID, content, ++numChildren);	
			}
						
			dbInsertPS.close();
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
			System.exit(-1);
		}
		catch(NullPointerException n)
		{
			System.out.println("Error: DB not Inited.");
			System.exit(-1);
		}
	}
	
	private void recursiveCommentsQuery(ArrayList<Comment> totalList, String parentID)
	{
		try
		{
			//prepare the statement		
			String queryStr = SELECT_STATEMENT_P1 + "parentID" + SELECT_STATEMENT_P2;
			PreparedStatement dbSelectPS = dbConn.prepareStatement(queryStr);
			dbSelectPS.setString(1, parentID);

			//execute and get the result
			ResultSet resultSet = dbSelectPS.executeQuery();
			
			//parse comment from resultSet
			while(resultSet.next())
			{
				Comment parseComment = new Comment
					(
						resultSet.getString("commentID"),
						resultSet.getString("userID"),
						resultSet.getString("parentID"),
						resultSet.getString("content"),
						resultSet.getTimestamp("date"),
						resultSet.getInt("numChildren")
					);
				totalList.add(parseComment);
				
				//recursively repeat query
				recursiveCommentsQuery(totalList, parseComment.getCommentID());
			}
			
			//close statement
			dbSelectPS.close();
		}
		catch (SQLException e) 
		{
			e.printStackTrace();
			System.exit(-1);
		}
		catch(NullPointerException n)
		{
			System.out.println("Error: DB not Inited.");
			System.exit(-1);
		}
	}
	
	/**
	 * Query comments from the comment DB
	 * Using a parent ID as the parent ID of the comments
	 * 
	 * @param parentID parentID of the comment to delete
	 * @param mode mode: 's': return list of comments in json form.
	 * 					 'c': return count of comments.
	 * @return JSON string of the returned comments, or count.
	 */
	public String queryCommentsByParentID(String parentID, char mode)
	{
		String commentListJSON = "";		
		
		//ArrayList for comments
		ArrayList<Comment> commentList= new ArrayList<Comment>();
			
		//get results in commentList
		recursiveCommentsQuery(commentList, parentID);
				
		//Convert comment arraylist to JSON format
		if(commentList.size() > 0)
		{
			commentListJSON += "[";
			for(int i=0; i<commentList.size()-1; i++)
				commentListJSON += commentList.get(i).toJSON() + ", ";
			commentListJSON += commentList.get(commentList.size()-1).toJSON();
			commentListJSON += "]";
		}
		
		if(mode=='s')
			return commentListJSON;
		if(mode=='c')
			return "{ \"count\": " + Integer.toString(commentList.size()) + " }";
		return "Error: incorrect mode.";
	}	
	
	/**
	 * Query comments from the comment DB
	 * Using a column value ID as the search parameter.
	 * Shallow search (not recursive).
	 *
	 * @param columnName Name of the column to query.
	 * @param columnID ID of the comments to be queried
	 * @return JSON string of the returned comments
	 */
	public String queryCommentsByColumnID(String columnName, String columnID)
	{
		try
		{
			String commentListJSON = "";		
			
			//ArrayList for comments
			ArrayList<Comment> commentList= new ArrayList<Comment>();
			
			//prepare the statement		
			String queryStr = SELECT_STATEMENT_P1 + columnName + SELECT_STATEMENT_P2;
			PreparedStatement dbSelectPS = dbConn.prepareStatement(queryStr);
			dbSelectPS.setString(1, columnID);

			//execute and get the result
			ResultSet resultSet = dbSelectPS.executeQuery();
			
			//parse comment from resultSet
			while(resultSet.next())
			{
				Comment parseComment = new Comment
					(
						resultSet.getString("commentID"),
						resultSet.getString("userID"),
						resultSet.getString("parentID"),
						resultSet.getString("content"),
						resultSet.getTimestamp("date"),
						resultSet.getInt("numChildren")
					);
				commentList.add(parseComment);				
			}
			
			//close statement
			dbSelectPS.close();
			
			//Convert comment arraylist to JSON format
			if(commentList.size() > 0)
			{
				commentListJSON += "[";
				for(int i=0; i<commentList.size()-1; i++)
					commentListJSON += commentList.get(i).toJSON() + ", ";
				commentListJSON += commentList.get(commentList.size()-1).toJSON();
				commentListJSON += "]";
			}
			
			return commentListJSON;
		}
		catch (SQLException e) 
		{
			e.printStackTrace();
			System.exit(-1);
		}
		catch(NullPointerException n)
		{
			System.out.println("Error: DB not Inited.");
			System.exit(-1);
		}
		
		return "Query failed.";
	}
	
	/**
	 * Query the n oldest (or newest) 1st Gen child comments from the comment DB.
	 *
	 * @param parentID parentID of the desired parent element.
	 * @param n How many (offset) oldest children are desired. If n is negative, the n newest children will be returned. 0 returns no comments.
	 * @param offset How much to offset the n oldest, or n newest if n is negative.
	 * @return JSON string of the returned comments. Empty string if no comments returned.
	 */
	public String queryCommentsByAge(String parentID, int n, int offset)
	{
		try
		{
			String commentListJSON = "";		
			
			//ArrayList for comments
			ArrayList<Comment> commentList= new ArrayList<Comment>();
			
			//prepare the statement		
			String queryStr = SELECT_STATEMENT_P1 + "parentID" + SELECT_STATEMENT_P2;
			queryStr += " ORDER BY date ";
			if(n>0)
				queryStr += "ASC";
			else
				queryStr += "DESC";
			n = (n>0)?n:-n;
			queryStr += " LIMIT " + Integer.toString(n) + " OFFSET " + Integer.toString(offset);
			PreparedStatement dbSelectPS = dbConn.prepareStatement(queryStr);
			dbSelectPS.setString(1, parentID);

			//execute and get the result
			ResultSet resultSet = dbSelectPS.executeQuery();
			
			//parse comment from resultSet
			while(resultSet.next())
			{
				Comment parseComment = new Comment
					(
						resultSet.getString("commentID"),
						resultSet.getString("userID"),
						resultSet.getString("parentID"),
						resultSet.getString("content"),
						resultSet.getTimestamp("date"),
						resultSet.getInt("numChildren")
					);
				commentList.add(parseComment);				
			}
			
			//close statement
			dbSelectPS.close();
			
			//Convert comment arraylist to JSON format
			if(commentList.size() > 0)
			{
				commentListJSON += "[";
				for(int i=0; i<commentList.size()-1; i++)
					commentListJSON += commentList.get(i).toJSON() + ", ";
				commentListJSON += commentList.get(commentList.size()-1).toJSON();
				commentListJSON += "]";
			}
			
			return commentListJSON;
		}
		catch (SQLException e) 
		{
			e.printStackTrace();
			System.exit(-1);
		}
		catch(NullPointerException nullErr)
		{
			System.out.println("Error: DB not Inited.");
			System.exit(-1);
		}
		
		return "Query failed.";
	}
	
	/**
	 * Wipe the contents from a comment.
	 * That means wiping the contents and/or the userID from a comment in the DB
	 * An incorrect mode will result in no change.
	 *
	 * @param commentID commentID of the comment to be wiped
	 * @param mode		'c': wipe just the content
	 * 					'u': wipe just the user
	 * 					'b': wipe the content and the user
	 */
	public void wipeCommentByCommentID(String commentID, char mode)
	{
		String commentJSON = queryCommentsByColumnID("commentID", commentID);

		ArrayList<String> flankers = new ArrayList<String>();
		flankers.add("\"userID\": \"");		flankers.add("\",");
		flankers.add("\"content\": \"");	flankers.add("\",");
		flankers.add("\"numChildren\": ");	flankers.add(" }");
		ArrayList<String> values = parseValues(commentJSON, flankers);
		String userID = values.get(0);
		String content = values.get(1);
		int numChildren = Integer.parseInt(values.get(2));
	
		if(mode=='c' || mode=='b')
			content = "[deleted]";
		if(mode=='u' || mode=='b')
			userID = "00000000000000000000000000000000";
		updateCommentByCommentID(commentID, userID, content, numChildren);
	}
	
	/**
	 * delete all comments on a post from the comment DB
	 * Using a post ID.
	 *
	 * @param postID postID of the comments to delete
	 */
	public String deleteCommentsByParentID(String postID)
	{
		try 
		{
			//get all comments that are children of the given post
			String childrenJSON = queryCommentsByParentID(postID, 's');
			
			if(childrenJSON.length() > 0)
			{
				//for each child comment
				int i = 0;
				int j = 0;
				while(true)
				{
					i = childrenJSON.indexOf("\"commentID\": \"", j);
					if(i < 0) break;
					i += "\"commentID\": \"".length();
					j = childrenJSON.indexOf("\",", i);
					
					//prepare the statement		
					PreparedStatement dbDeletePS = dbConn.prepareStatement(DELETE_STATEMENT);
					dbDeletePS.setString(1, childrenJSON.substring(i, j));
					
					//execute
					dbDeletePS.executeUpdate();
					
					//close
					dbDeletePS.close();
				}
				return "Success: Comments from postID=" + postID + " deleted.";		
			}
			else
				return "Failure: No comments from postID=" + postID + " found for deletion.";		
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
			System.exit(-1);
		}
		catch(NullPointerException n)
		{
			System.out.println("Error: DB not Inited.");
			System.exit(-1);
		}
		return "Failure: An error occured when attempting to delete comments from postID=" + postID + ".";	
	}		
	
	/**
	 * update a comment's content on a post from the comment DB
	 * Using a comment ID.
	 *
	 * @param commentID commentID of the comments to update
	 * @param userID	new userID
	 * @param content	new content of the comment
	 * @param numChildren	new number of children
	 */
	public void updateCommentByCommentID(String commentID, String userID, String content, int numChildren)
	{
		//prepare the statement		
		PreparedStatement dbUpdatePS;
		try 
		{
			dbUpdatePS = dbConn.prepareStatement(UPDATE_STATEMENT);
		
			dbUpdatePS.setString(1, userID);
			dbUpdatePS.setString(2, content);
			dbUpdatePS.setInt(3, numChildren);
			dbUpdatePS.setString(4, commentID);
			
			//execute
			dbUpdatePS.executeUpdate();
			
			//close
			dbUpdatePS.close();
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
			System.exit(-1);
		}
		catch(NullPointerException n)
		{
			System.out.println("Error: DB not Inited.");
			System.exit(-1);
		}
	}
	
	/**
	 * close DB connection
	 */
	void closeDBConnection()
	{
		try 
		{
			dbConn.close();
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
	}
	
	/**
	 * Main tests connecting to the DB (requires correct config file),
	 * inserting 2 comments, and then reading them by post.
	 * 
	 * @param args
	 */
	public static void main(String[] args) 
	{
		System.out.println("Hello Comment World!");
		
		//connect to the database
		CommentDBManager dbManager = new CommentDBManager();
		dbManager.readDBCredentials("src/main/java/comments/config.ini");
		
		dbManager.initDBConnection();
		
		
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~tests which leave no trace~~~~~~~~~~~~~~~~~~~~~~~~~~~
		System.out.println("\n~~~~~~~~~~~~~~~~~~begin test 1~~~~~~~~~~~~~~~~~~");
		//insert comment 1		
		Comment comment1 = new Comment("cID1", "uID1", "pID1", "This is test comment 1.", new Timestamp(System.currentTimeMillis()), 0);
		dbManager.insertCommentRow(comment1);
		
		//insert comment 2
		Comment comment2 = new Comment("cID2", "uID2", "cID1", "This is test comment 2.", new Timestamp(System.currentTimeMillis()), 0);
		dbManager.insertCommentRow(comment2);
		
		//insert comment 3
		Comment comment3 = new Comment("cID3", "uID3", "cID2", "This is test comment 3.", new Timestamp(System.currentTimeMillis()), 0);
		dbManager.insertCommentRow(comment3);
		
		//insert comment 4
		Comment comment4 = new Comment("cID4", "uID3", "pID1", "This is test comment 4.", new Timestamp(System.currentTimeMillis()), 0);
		dbManager.insertCommentRow(comment4);
		
		//read comments
		System.out.println(dbManager.queryCommentsByParentID("pID1", 's'));
		
		//update a comment
		dbManager.updateCommentByCommentID(comment1.getCommentID(), comment1.getUserID(),  "This is an updated comment.", comment1.getNumChildren());
		
		//wipe a comment
		dbManager.wipeCommentByCommentID(comment2.getCommentID(), 'b');
		
		//read comments again
		System.out.println(dbManager.queryCommentsByParentID("pID1", 's'));
		
		//read a specific comment out
		System.out.println(dbManager.queryCommentsByColumnID("commentID", "cID4"));
				
		//delete comments
		System.out.println(dbManager.deleteCommentsByParentID("pID1"));
		
		
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~tests which require DB entries~~~~~~~~~~~~~~~~~~~~~~~~~~~
		System.out.println("\n~~~~~~~~~~~~~~~~~~begin test 2~~~~~~~~~~~~~~~~~~");

		//get oldest 2 comments
		System.out.println(dbManager.queryCommentsByAge("424766c4-6bc1-11ea-a989-0ac9002d85a0", 2, 0));
		
		//get next oldest 2 comments
		System.out.println(dbManager.queryCommentsByAge("424766c4-6bc1-11ea-a989-0ac9002d85a0", 2, 2));
	
		//get newest 2 comments
		System.out.println(dbManager.queryCommentsByAge("aa2822f7-6bd5-11ea-a989-0ac9002d85a0", -2, 0));
		
		//get next newest 2 comments
		System.out.println(dbManager.queryCommentsByAge("aa2822f7-6bd5-11ea-a989-0ac9002d85a0", -2, 2));
		
		//close
		dbManager.closeDBConnection();
	}
}
