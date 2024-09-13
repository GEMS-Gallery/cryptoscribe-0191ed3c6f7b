import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Time "mo:base/Time";
import Option "mo:base/Option";
import Order "mo:base/Order";

actor {
  // Define the Post type
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Int;
  };

  // Stable variable to store posts
  stable var posts : [Post] = [];
  stable var nextId : Nat = 0;

  // Create a new post
  public func createPost(title: Text, body: Text, author: Text) : async Nat {
    let post : Post = {
      id = nextId;
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := Array.append(posts, [post]);
    nextId += 1;
    nextId - 1
  };

  // Get all posts, sorted by timestamp (most recent first)
  public query func getPosts() : async [Post] {
    Array.sort(posts, func (a: Post, b: Post) : Order.Order {
      if (a.timestamp > b.timestamp) { #less }
      else if (a.timestamp < b.timestamp) { #greater }
      else { #equal }
    })
  };
}